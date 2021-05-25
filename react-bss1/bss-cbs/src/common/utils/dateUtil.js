import padStart from 'lodash/padStart';

export const relativeDate = date => {
  const currentDate = dayjs();
  const year = currentDate.diff(date, 'year');
  const month = currentDate.diff(date, 'month') - year * 12;
  const day = currentDate.diff(date, 'day');
  const yearString = year === 0 ? '' : `${year} year${year === 1 ? '' : 's'} `;
  const monthString =
    month === 0 ? '' : `${month} month${month === 1 ? '' : 's'} ago`;
  const dayString =
    day === 0 ? 'today' : `${day} day${day === 1 ? '' : 's'} ago`;
  const relativeDateString = month > 0 ? yearString + monthString : dayString;
  return relativeDateString;
};

export const convertMS = milliseconds => {
  var day;
  var hour;
  var minute;
  var seconds;
  seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(seconds / 60);
  seconds %= 60;
  hour = Math.floor(minute / 60);
  minute %= 60;
  day = Math.floor(hour / 24);
  hour %= 24;
  return {
    day: padStart(day, 2, '0'),
    hour: padStart(hour, 2, '0'),
    minute: padStart(minute, 2, '0'),
    seconds: padStart(seconds, 2, '0')
  };
};
