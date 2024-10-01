const axios = require('axios');
const cheerio = require('cheerio');

const getGitlabActivities = async (values) => {
  const resp = {};
  const filters = getFilters(values);
  let startDate = new Date(filters.from);

  while (startDate <= new Date(filters.to)) {
    const date = startDate.toISOString().split('T')[0];
    const activities = await getGitlabActivitiesByDate(date);

    if (activities.length) {
      resp[date] = arrayToObjectByKey(activities, 'action');
    }

    startDate.setDate(startDate.getDate() + 1);
  }

  console.log(resp);
  return resp;
};
const getFilters = (values) => {
  const filters = {};
  const keyMap = {
    f: 'from',
    from: 'from',
    t: 'to',
    to: 'to',
  };

  if (values?.length) {
    for (const item of values) {
      let [key, ...itemValues] = item.split(' ');
      const itemValue = itemValues.join(' ');

      if (key.charAt(0) === '-') {
        key = key.substring(1);
      }

      const dt = new Date(itemValue).toISOString().split('T')[0];

      if (dt) {
        filters[keyMap[key]] = dt;
      }
    }
  } else {
    filters.from = new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split('T')[0];
    filters.to = new Date().toISOString().split('T')[0];
  }

  return filters;
};
const getGitlabActivitiesByDate = async (date) => {
  const { getGitLabAuth, removeEmpty } = require('./utils');
  const { userId, url, cookie, xCsrfToken } = await getGitLabAuth();
  const gitlabUrl = `${url}/users/${userId}/calendar_activities?date=${date}`;
  const headers = {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ml;q=0.7',
    'cache-control': 'no-cache',
    cookie,
    pragma: 'no-cache',
    referer: `${url}/${userId}`,
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'x-csrf-token': xCsrfToken,
    'x-requested-with': 'XMLHttpRequest',
  };
  // let config = { method: 'get', maxBodyLength: Infinity, url: `${gitlabUrl}2024-5-10`, headers };

  try {
    const response = await axios.get(gitlabUrl, { headers });

    const $ = cheerio.load(response.data);

    // Initialize an empty array to store the JSON objects
    let contributions = [];

    // Iterate over each list item
    $('ul.bordered-list li').each((i, element) => {
      const $element = $(element);
      const time = $element.find('span.js-localtime').text().trim();
      const action = $element
        .contents()
        .filter(function () {
          return this.nodeType === 3; // Text nodes
        })
        .text()
        .trim()
        .split(/\n/g)[0]
        .trim();
      const detailsArray = $element
        .find('a')
        .map((i, el) => {
          return {
            title: $(el).attr('title'),
            href: $(el).attr('href').split(/\/-\//g)[1],
            text: $(el).text().trim().replace(/!/g, ''),
          };
        })
        .get();
      const details = detailsArray.reduce((acc, item) => {
        if (item.title === 'medica-portal-client') {
          acc.repo = item.title;
        } else {
          acc = removeEmpty(item);
        }

        return acc;
      }, {});

      contributions.push({
        time,
        action,
        ...details,
      });
    });

    return contributions;
  } catch (error) {
    console.log(error.message);
  }
};
const arrayToObjectByKey = (arr, key) => {
  return arr.reduce((acc, obj) => {
    acc[obj[key]] = obj;

    return acc;
  }, {});
};

module.exports = { getGitlabActivities };
