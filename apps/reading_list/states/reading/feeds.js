// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */

ReadingList.ReadingFeedsState = SC.State.extend({

  initialSubstate: 'browsing',

  browsing: SC.State.design(),

  configuring: SC.State.plugin('ReadingList.FeedSettingsState'),

  enterState: function () {
    var view = ReadingList.mainPage.get('feeds');

    if (!view.get('isVisible')) {
      view.adjust({
        left: -1 * view.get('frame').width,
        right: 0
      });

      view.set('isVisible', YES);
      setTimeout(function () {
        SC.run(function () {
          // Translate left 100%
          view.animate({
            left: 0,
            right: 0
          }, {
            timing: 'ease-out',
            duration: .25
           });
        });
      }, 0);
    }
  },

  exitState: function () {
    var view = ReadingList.mainPage.get('feeds');

    setTimeout(function () {
      SC.run(function () {
        // Translate right 100%
        view.animate({
          left: -1 * view.get('frame').width,
          right: 0
        }, {
          timing: 'ease-out',
          duration: .25
        }, function () {
          view.set('isVisible', NO);
        });
      });
    }, 0);
  },

  browseEntries: function () {
    this.gotoState('entries');
  },

  editFeeds: function () {
    this.gotoState('editing');
  },

  configureSettings: function () {
    this.gotoState(this.get('configuring'));
  }
});
