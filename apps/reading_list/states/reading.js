// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */

ReadingList.ReadingState = SC.State.extend({

  initialSubstate: 'feeds',

  feeds: SC.State.plugin('ReadingList.ReadingFeedsState'),

  entries: SC.State.plugin('ReadingList.ReadingEntriesState'),

  enterState: function () {
    var reader = ReadingList.mainPage.get('reader');

    if (!reader.get('isVisible')) {
      reader.set('isVisible', YES);
      ReadingList.scheduleAnimation(reader, function () {
        // Fade in
        reader.animate({
          opacity: 1
        }, {
          timing: ReadingList.TIMING,
          duration: ReadingList.DURATION
        });
      });
    }
  },

  exitState: function () {
    var reader = ReadingList.mainPage.get('reader');

    ReadingList.scheduleAnimation(reader, function () {
      // Fade out
      reader.animate({
        opacity: 0
      }, {
        timing: ReadingList.TIMING,
        duration: ReadingList.DURATION
      }, function () {
        reader.set('isVisible', NO);
      });
    });
  }

});
