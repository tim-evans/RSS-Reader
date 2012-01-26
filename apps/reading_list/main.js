// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */

ReadingList.main = function main() {
  ReadingList.getPath('mainPage.mainPane').append();

  ReadingList.feedController.set('content',
    ReadingList.store.find(SC.Query.local(RSS.Feed)));

  ReadingList.feedManagerController.set('content',
    ReadingList.store.find(SC.Query.local(RSS.Feed, 'isSelected = true')));
};

function main() { ReadingList.main(); }
