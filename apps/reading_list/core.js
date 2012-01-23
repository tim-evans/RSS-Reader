// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */

/** @namespace
  A simple reading list application using RSS feeds.

  @extends SC.Application
 */
ReadingList = SC.Application.create(
  /** @scope ReadingList.prototype */ {

  NAMESPACE: 'ReadingList',
  VERSION: '0.1.0',

  store: SC.Store.create().from(
    RSS.DataSource.create({
      apiKey: 'ABQIAAAADlwE3RKFzEtkSuR_WUnTHxStcdMUtx7eZCS9OGF3zYmEWzqo3RQl4N-hJK1M0G2fLgD48F8PYB82hg'
    }))
});
