// eslint-disable-next-line no-undef
module.exports = {
  removeEmpty: (obj) => {
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
  },
};
