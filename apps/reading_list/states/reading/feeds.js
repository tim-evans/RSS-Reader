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
    var feeds = ReadingList.mainPage.get('feeds'),
        content = ReadingList.mainPage.getPath('feeds.content'),
        header = ReadingList.mainPage.getPath('feeds.header'),
        footer = ReadingList.mainPage.getPath('feeds.footer');

    if (!feeds.get('isVisible')) {
      var width = content.get('frame').width;

      content.adjust({
        left: -1 * width,
        right: width
      });

      header.adjust({
        left: -1 * width / 20,
        right: width / 20,
        opacity: 0
      });

      footer.adjust({
        left: -1 * width / 20,
        right: width / 20,
        opacity: 0
      });

      feeds.set('isVisible', YES);
      ReadingList.scheduleAnimation(feeds, function () {
        // Translate left 100%
        content.animate({
          left: 0,
          right: 0
        }, {
          timing: ReadingList.TIMING,
          duration: ReadingList.DURATION
        });

        header.animate({
          left: 0,
          right: 0,
          opacity: 1
        }, {
          timing: ReadingList.TIMING,
          duration: ReadingList.DURATION
        });

        footer.animate({
          left: 0,
          right: 0,
          opacity: 1
        }, {
          timing: ReadingList.TIMING,
          duration: ReadingList.DURATION
        });
      });
    }
  },

  exitState: function () {
    var feeds = ReadingList.mainPage.get('feeds'),
        content = ReadingList.mainPage.getPath('feeds.content'),
        header = ReadingList.mainPage.getPath('feeds.header'),
        footer = ReadingList.mainPage.getPath('feeds.footer'),
        width = content.get('frame').width;

    ReadingList.scheduleAnimation(feeds, function () {
      // Translate right 100%
      content.animate({
        left: -1 * width,
        right: width
      }, {
        timing: ReadingList.TIMING,
        duration: ReadingList.DURATION
      }, function () {
        feeds.set('isVisible', NO);
      });

      header.animate({
        left: -1 * width / 20,
        right: width - width / 20,
        opacity: 0
      }, {
        timing: ReadingList.TIMING,
        duration: ReadingList.DURATION
      });

      footer.animate({
        left: -1 * width / 20,
        right: width - width / 20,
        opacity: 0
      }, {
        timing: ReadingList.TIMING,
        duration: ReadingList.DURATION
      });
    });
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
