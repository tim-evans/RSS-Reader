// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */

ReadingList.ReadingEntriesState = SC.State.extend({

  enterState: function () {
    var view = ReadingList.mainPage.get('entries');

    view.adjust({
      left: view.get('frame').width,
      right: -1 * view.get('frame').width
    });

    view.set('isVisible', YES);
    setTimeout(function () {
      // Translate right 100%
      SC.run(function () {
        view.animate({
          left: 0,
          right: 0
        }, {
          timing: 'ease-out',
          duration: .25
        });
      });
    }, 0);
  },

  exitState: function () {
    var view = ReadingList.mainPage.get('entries');

    setTimeout(function () {
      SC.run(function () {
        // Translate left 100%
        view.animate({
          left: view.get('frame').width,
          right: -1 * view.get('frame').width
        }, {
          timing: 'ease-out',
          duration: .25
        }, function () {
          view.set('isVisible', NO);
        });
      });
    }, 0);
  },

  browseFeeds: function () {
    this.gotoState('feeds.browsing');
  }

});
