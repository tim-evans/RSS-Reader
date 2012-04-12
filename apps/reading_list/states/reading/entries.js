// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */

ReadingList.ReadingEntriesState = SC.State.extend({

  enterState: function () {
    var entries = ReadingList.mainPage.get('entries'),
        content = ReadingList.mainPage.getPath('entries.content'),
        header = ReadingList.mainPage.getPath('entries.header'),
        footer = ReadingList.mainPage.getPath('entries.footer'),
        width = content.get('frame').width;

    content.adjust({
      left: width,
      right: -1 * width
    });

    header.adjust({
      left: width / 20,
      right: -1 * width / 20,
      opacity: 0
    });

    footer.adjust({
      left: width / 20,
      right: -1 * width / 20,
      opacity: 0
    });

    entries.set('isVisible', YES);
    ReadingList.scheduleAnimation(entries, function () {
      // Translate right 100%
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
  },

  exitState: function () {
    var entries = ReadingList.mainPage.get('entries'),
        content = ReadingList.mainPage.getPath('entries.content'),
        header = ReadingList.mainPage.getPath('entries.header'),
        footer = ReadingList.mainPage.getPath('entries.footer'),
        width = content.get('frame').width;

    ReadingList.scheduleAnimation(entries, function () {
      // Translate left 100%
      content.animate({
        left: width,
        right: -1 * width
      }, {
        timing: ReadingList.TIMING,
        duration: ReadingList.DURATION
      }, function () {
        entries.set('isVisible', NO);
      });

      header.animate({
        left: width / 20,
        right: -1 * width / 20,
        opacity: 0
      }, {
        timing: ReadingList.TIMING,
        duration: ReadingList.DURATION
      });

      footer.animate({
        left: width / 20,
        right: -1 * width / 20,
        opacity: 0
      }, {
        timing: ReadingList.TIMING,
        duration: ReadingList.DURATION
      });
    });
  },

  browseFeeds: function () {
    this.gotoState('feeds.browsing');
  },

  refresh: function () {
    var feed = ReadingList.feedController.get('content');
    feed.refresh(YES, this.didRefreshFeed(feed.get('feedUrl')));
  },

  /**
    Update the content of the feedController since
    `entries` gets replaced as soon as the `refresh`
    finishes. This makes the refresh system seamless.
   */
  didRefreshFeed: function (id) {
    return function () {
      ReadingList.feedController.set('content',
        ReadingList.store.find(RSS.Feed, id));
    };
  }

});
