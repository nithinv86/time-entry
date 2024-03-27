const fs = require('fs');
const { keyMap } = require('./config');
const accessFile = (path, callback) => {
  fs.access(path, fs.constants.F_OK, callback());
};
const appendFileSync = (path, data) => {
  try {
    fs.appendFileSync(path, data);
  } catch (error) {
    console.log(error);
  }
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
const existsSync = (path) => {
  return fs.existsSync(path);
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
const readFileSync = (path) => {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (error) {
    console.log(error);
  }
};
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
const writeFileSync = (path, data) => {
  try {
    fs.writeFileSync(path, data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  accessFile,
  appendFileSync,
  convertToTaskData,
  existsSync,
  groupBy,
  readFileSync,
  removeEmpty,
  writeFileSync,
};
