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
  const { userId } = await getGitLabAuth();
  const gitlabUrl = `https://gitlab.4medica.net/users/${userId}/calendar_activities?date=`;
  const headers = {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ml;q=0.7',
    'cache-control': 'no-cache',
    cookie:
      'preferred_language=en; remember_user_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IlcxczNOVjBzSWlReVlTUXhNQ1J4TkhsVlFuWlRZa1pEUzNsTloyUkZTaTR3UVRSbElpd2lNVGN5TURNeU5UUTVOUzR4TkRNd05qRWlYUT09IiwiZXhwIjoiMjAyNC0wNy0yMVQwNDoxMTozNS4xNDNaIiwicHVyIjoiY29va2llLnJlbWVtYmVyX3VzZXJfdG9rZW4ifX0%3D--837c4dd5167a603ad95fee9ed343af1376d1a74e; known_sign_in=TXFiYi9xZTkzOWpYS0RFd1UrQmpxNzIyZU5jL0NXckJEN0l6cVB4d0piR0wzNTFQT0l3TWxVUTMxQ1NlZ1dxS0kwVytXekhUOW1lTmIrK3V6WHZ2OUlESGhsNm1BL1RJL0Vza2VsbzNueE1sUlVGZ0YvWDdnNk5mTXcvNTdEeXgtLVlVWlVucFVtc1pPS2dzSjV5WStIUUE9PQ%3D%3D--9c31a4f691362092630c1a3e014a17ce0da940d8; _gitlab_session=35942d45329e0463adf0ee597cf23be6; event_filter=all',
    pragma: 'no-cache',
    referer: `https://gitlab.4medica.net/${userId}`,
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'x-csrf-token':
      'IAMWPXhisEhwzy_-za_1jQShB3Dr6k-LRgms_U6TgvbpMdTWtMkxyWTAcC_z3eeXqHoboPgcdE_VxIaPeRArNQ',
    'x-requested-with': 'XMLHttpRequest',
  };
  // let config = { method: 'get', maxBodyLength: Infinity, url: `${gitlabUrl}2024-5-10`, headers };

  try {
    const response = await axios.get(`${gitlabUrl}${date}`, { headers });

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
