const axios = require('axios');
const { headers } = require('./config');
const getSprints = async ({ params }) => {
  const p = {
    index: params.index || 1,
    range: params.range || 150,
    project: params.project || '139011000000148327',
    action: 'data',
    team: '803166918',
  };

  if (params?.type) {
    if (typeof params.type === 'string') {
      p.type = params.type.split(',');
    } else {
      p.type = params.type;
    }
  } else {
    p.type = ['2', '3'];
  }
  const parentUrl = `https://externalusers.zohosprints.com/zsapi/team/${p.team}/projects/${
    p.project
  }/sprints/?action=${p.action}&range=${p.range}&type=${encodeURIComponent(
    JSON.stringify(p.type),
  )}&index=${p.index}`;

  try {
    const response = await axios.get(parentUrl, { headers });

    return Object.entries(response.data.sprintJObj)
      .map(([key, value]) => ({ value: key, label: value[0] }))
      .sort((a, b) => (a.label < b.label ? 1 : a.label > b.label ? -1 : 0));
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { getSprints };
