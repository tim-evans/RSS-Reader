// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */

ReadingList.FeedManagerState = SC.State.extend(
  /** @scope ReadingList.FeedManagerState.prototype */{

  enterState: function () {
    var view = ReadingList.mainPage.get('manager');

    view.set('isVisible', YES);
    view.adjust({ top: view.getPath('frame').height,
                  bottom: -1 * view.getPath('frame').height });

    // Translate 100% up
    setTimeout(function () {
      SC.run(function () {
        view.animate({
          top: 0,
          bottom: 0
        }, {
          timing: 'ease-out',
          duration: .25
        });
      });
    }, 0);

    // Reset selection
    ReadingList.feedManagerController.setEach('isSelected', NO);
  },

  removeSelectedFeeds: function () {
    ReadingList.feedManagerController.invoke('destroy');
    this.gotoState('inbox');
  },

  cancel: function () {
    this.gotoState('inbox');
  },

  exitState: function () {
    var view = ReadingList.mainPage.get('manager');

    // Translate 100% down
    view.animate({
      top: view.get('frame').height,
      bottom: -1 * view.get('frame').height
    }, {
      timing: 'ease-out',
      duration: .25
    }, function () {
      view.set('isVisible', NO);
    });
  }
});
