const { format, subDays } = require('date-fns');
const path = require('path');
const { userHomeDir, readFileSync } = require('./utils');
const roundTimeTo5 = (timeStr) => {
  timeStr = timeStr.replace(/[^0-9\s]/g, '');
  const [minutes, seconds] = timeStr.split(' ').map(Number);
  const totalSeconds = minutes * 60 + seconds;
  const roundedSeconds = 300 * Math.max(totalSeconds / 300);
  const roundedMinutes = Math.floor(roundedSeconds / 60);

  return roundedMinutes;
};
const getLastDayOfWeek = (inputString) => {
  const currentDate = new Date();
  let targetDate = currentDate;

  switch (inputString.toLowerCase()) {
    case 'today': {
      targetDate = currentDate;

      break;
    }
    case 'yesterday': {
      targetDate = subDays(currentDate, 1);

      break;
    }
    default: {
      targetDate = currentDate;

      while (format(targetDate, 'EEEE').toLowerCase() !== inputString.toLowerCase()) {
        targetDate = subDays(targetDate, 1);
      }
    }
  }

  return targetDate;
};

const filterCalls = async (values) => {
  const filePath = path.join(userHomeDir, 'Desktop/call.txt');
  const data = {};
  const content = readFileSync(filePath);
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

      if (keyMap[key]) {
        data[keyMap[key]] = new Date(itemValue).toISOString().split('T')[0];
      } else {
        data.data = itemValue;
      }
    }
  }

  let start = false;
  const calls = content?.split(/\n\n/g).reduce((acc, curr) => {
    if (curr.includes('Contact groups')) {
      start = false;
    }

    if (start) {
      const daysOfWeek = [
        'Today',
        'Yesterday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let [person, direction, time, day] = curr.split(/\n/g);

      if (day && roundTimeTo5(time)) {
        if (daysOfWeek.includes(day)) {
          day = format(getLastDayOfWeek(day), 'yyyy-MM-dd');
        }

        acc.add({ day, person, time: roundTimeTo5(time) });
      }
    }

    if (curr.includes('Voicemail')) {
      start = true;
    }

    return acc;
  }, new Set());

  console.log(calls);
};

module.exports = { filterCalls };
