const { keyMap } = require('./config');

module.exports = { convertToTaskData, groupBy, removeEmpty };

const removeEmpty = (obj) => {
  for (let [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object') {
      this.removeEmpty(val);

      if (!(Object.keys(val).length || val instanceof Date)) {
        delete obj[key];
      }
    } else {
      if (typeof val === 'string') {
        val = val.trim();
      }

      if (val === null || val === undefined || val === '') {
        delete obj[key];
      } else {
        obj[key] = val;
      }
    }
  }

  return obj;
};
const groupBy = (arr, key) => {
  return arr.reduce((acc, obj) => {
    const group = obj[key];

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(obj);

    return acc;
  }, {});
};
const convertToTaskData = (values) => {
  const data = {};

  for (const item of values) {
    let [key, ...itemValues] = item.split(' ');
    let itemValue = itemValues.join(' ');

    if (key.charAt(0) === '-') {
      key = key.substring(1);
    }

    switch (key) {
      case 's':
      case 'sprint': {
        if (!itemValue.includes('sprint')) {
          itemValue = `sprint ${itemValue}`;
        }

        data[keyMap[key]] = itemValue;

        break;
      }

      case 'dt':
      case 'date': {
        data[keyMap[key]] = new Date(itemValue).toISOString();

        break;
      }

      case 'du':
      case 'duration': {
        data[keyMap[key]] = +itemValue;

        break;
      }

      default: {
        data[keyMap[key]] = itemValue;

        break;
      }
    }

    return data;
  }
};
