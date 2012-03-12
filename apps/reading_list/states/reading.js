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
      setTimeout(function () {
        SC.run(function () {
          // Fade in
          reader.animate({
            opacity: 1
          }, {
            timing: 'ease-out',
            duration: .25
          });
        });
      }, 0);
    }
  },

  exitState: function () {
    var reader = ReadingList.mainPage.get('reader');

    setTimeout(function () {
      SC.run(function () {
        // Fade out
        reader.animate({
          opacity: 0
        }, {
          timing: 'ease-out',
          duration: .25
        }, function () {
          reader.set('isVisible', NO);
        });
      });
    }, 0);
  }

});
