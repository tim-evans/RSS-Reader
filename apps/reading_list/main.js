// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */

ReadingList.main = function main() {
  ReadingList.getPath('mainPage.mainPane').append();

  ReadingList.feedsController.set('content',
    ReadingList.store.find(SC.Query.local(RSS.Feed, 'status = 513 OR status = 514')));

  ReadingList.editorController.set('content',
    ReadingList.store.find(SC.Query.local(RSS.Feed, 'isSelected = true')));

  ReadingList.statechart.initStatechart();

  SC.userDefaults.defaults({
    'app:feeds': ['http://blog.sproutcore.com/feed']
  });

  var feeds = SC.userDefaults.get('feeds') || [];
  for (var i = 0; i < feeds.length; i++) {
    ReadingList.store.find(RSS.Feed, feeds[i]);
  }
};

function main() { ReadingList.main(); }
