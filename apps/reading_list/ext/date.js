/**
  Returns whether the two days are on the same day.
  @param {Date}
  @param {Date}
 */
SC.isSameDay = function (now, day) {
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      time = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  return today.getTime() === time;
};

SC.isDayBefore = function (now, day) {
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      time = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  return (today.getTime() - 86400000) === time;
};

SC.isSameWeek = function (now, day, startsOnMonday) {
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      time = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime(),
      beginningOfWeek = today.getTime() - today.getDay() * 86400000,
      endOfWeek = beginningOfWeek + 604800000;

  return time >= beginningOfWeek &&
         time <= endOfWeek;
};

SC.isLastWeek = function (now, day, startsOnMonday) {
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      time = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime(),
      beginningOfWeek = today.getTime() - today.getDay() * 86400000,
      beginningOfLastWeek = beginningOfWeek - 604800000,
      endOfLastWeek = beginningOfLastWeek + 604800000;

  return time >= beginningOfLastWeek &&
         time <= endOfLastWeek;
};