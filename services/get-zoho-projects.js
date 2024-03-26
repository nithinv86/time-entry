const axios = require('axios');
const { getHeaders } = require('./config');
const getProjects = async () => {
  const headers = await getHeaders();
  const p = {
    action: 'recentprojects',
    team: '803166918',
  };
  const parentUrl = `https://externalusers.zohosprints.com/zsapi/team/${p.team}/projects/?action=${p.action}`;

  try {
    const response = await axios.get(parentUrl, { headers });

    return Object.entries(response.data.projectJObj)
      .map(([key, value]) => ({ value: key, label: value[0] }))
      .sort((a, b) => (a.label < b.label ? 1 : a.label > b.label ? -1 : 0));
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { getProjects };
