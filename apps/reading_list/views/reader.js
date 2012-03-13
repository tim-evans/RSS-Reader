// ==========================================================================
// Project:   ReadingList.ReaderView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed');
require('views/entry');

/**
  A card that can be swiped in and out using gestures
  on touch devices and makes up items in a deck.
  @extend SC.View
 */
ReadingList.ReaderView = SC.View.extend(
  /** @scope ReadingList.ReaderView.prototype */{

  childViews: ['feeds', 'entries', 'thumb'],

  feeds: ReadingList.FeedView.design(),

  entries: ReadingList.EntryView.design({
    isVisible: NO
  }),

  thumb: SC.ThumbView.design({
    layout: { right: 0, bottom: 0, height: 33, width: 19, zIndex: 12 }
  })

});
