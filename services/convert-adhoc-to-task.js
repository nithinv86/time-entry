/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { getAdhoc } = require('./get-adhoc');
const { markAsSynced } = require('./mark-as-synced');
const { addTask } = require('./add-task');

module.exports = {
  convertAdhocToTask: async () => {
    const response = await getAdhoc();
    let count = 0;
    const formattedResponse = (response || []).reduce((data, item) => {
      const adhocActivities = [
        'Sprint demo',
        'Grooming',
        'Iteration planning',
        'Daily scrum',
        'Sprint retro',
        'Team activity',
        'Release support',
        'UI demo',
        'Scrum extra',
        'Task estimation and review',
        'Team support',
      ];

      if (!data[item.date]) {
        data[item.date] = { adhoc: {}, internalConnects: {} };
      }

      const { personOrMeeting, duration, notes, ...entries } = item;
      const formattedNote = `\n${personOrMeeting} - ${duration}m ${notes ? '(' + notes + ')' : ''}`;

      entries.notes = '';
      entries.duration = 0;
      entries.workType = adhocActivities.includes(item.personOrMeeting)
        ? 'Adhoc'
        : 'Internal connects';

      if (adhocActivities.includes(item.personOrMeeting)) {
        if (!Object.keys(data[item.date].adhoc).length) {
          data[item.date].adhoc = entries;
        }

        data[item.date].adhoc.notes += formattedNote;
        data[item.date].adhoc.duration += duration;
      } else {
        if (!Object.keys(data[item.date].internalConnects).length) {
          data[item.date].internalConnects = entries;
        }

        data[item.date].internalConnects.notes += formattedNote;
        data[item.date].internalConnects.duration += duration;
      }

      markAsSynced(entries.id);

      return data;
    }, {});

    for (const datewise of Object.values(formattedResponse)) {
      for (const entries of Object.values(datewise)) {
        if (Object.values(entries).length) {
          count++;

          addTask(entries);
        }
      }
    }

    return `${count} records updated successfully.`;
  },
};
