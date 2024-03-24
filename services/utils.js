const { keyMap } = require('./config');
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
  return values.reduce((acc, item) => {
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

        acc[keyMap[key]] = itemValue;

        break;
      }

      case 'dt':
      case 'date': {
        acc[keyMap[key]] = new Date(itemValue).toISOString();

        break;
      }

      case 'du':
      case 'duration': {
        acc[keyMap[key]] = +itemValue;

        break;
      }

      default: {
        acc[keyMap[key]] = itemValue;

        break;
      }
    }

    return acc;
  }, {});
};

module.exports = { convertToTaskData, groupBy, removeEmpty };
