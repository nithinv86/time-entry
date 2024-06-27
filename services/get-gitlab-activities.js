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
  const git = await getGitLabAuth();
  const gitlabUrl = `${git.url}/users/${git.userId}/calendar_activities?date=`;
  const headers = {
    accept: 'application/json, text/plain, */*',
    'cache-control': 'no-cache',
    cookie:
      'preferred_language=en; remember_user_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IlcxczNOVjBzSWlReVlTUXhNQ1J4TkhsVlFuWlRZa1pEUzNsTloyUkZTaTR3UVRSbElpd2lNVGN4T1RRMU56QXhOeTQwT1RRNE1UazVJbDA9IiwiZXhwIjoiMjAyNC0wNy0xMVQwMjo1Njo1Ny40OTRaIiwicHVyIjoiY29va2llLnJlbWVtYmVyX3VzZXJfdG9rZW4ifX0%3D--0c28f45fe68d006723718185ba94f13abe1bf4d1; known_sign_in=TWdsa2lUREhkZ1dPc0NzY0FIK09PQW5UaHVmR1dyVWJpcDU4Y1lrYnNETm1DU3ZyM21hQVVOclVZNmtxeVU5Nm4ySFlrSDc4QWJDS1pudWlmVmxOM2xvQnYvaXhmRm9FcFIxZzkyUnRFWlZiL0o0N1lFQnlqTldZKzk5MitMeUUtLXhFYUIzOXREVzZWenpSSDVRak5qdmc9PQ%3D%3D--74714f00dfbe3b02444a2a35b644f1f6217df8f2; _gitlab_session=30d0a4c3125e2c040852edfadc8f2fe6; _gitlab_session=ad2432878d37cc51e98c3c30f674e5ec',
  };

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
