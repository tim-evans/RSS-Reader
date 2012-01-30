require('core');

/**
  A simple data source for retrieving feeds via RSS
  (Really Simple Syndication) using the Google Feeds API.

  @see http://code.google.com/apis/feed/v1/jsondevguide.html
  @extends SC.DataSource
 */
RSS.DataSource = SC.DataSource.extend(
  /** @scope RSS.DataSource.prototype */{

  /**
    The URL to use to request the RSS feed from.
    @type String
    @default 'https://ajax.googleapis.com/ajax/services/feed/'
   */
  url: 'https://ajax.googleapis.com/ajax/services/feed/',

  /**
    
   */
  fetch: function (store, query) {
    var recordType = query.recordType,
        key = this.get('apiKey');

    if (SC.guidFor(recordType) === SC.guidFor(RSS.Entry)) {
      $.getJSON(this.get('url') + 'find' +
                '?v=1.0' +
                '&q=' + query.conditions.query +
                '&key=' + key +
                '&num=-1' +
                '&hl=' + SC.Locale.currentLanguage +
                '&callback=?', function (result) {

        if (result.responseStatus === 200) {
          var storeKeys = store.loadRecords(RSS.Entry, result.responseData.entries);
          store.loadQueryResults(query, storeKeys);
          store.dataSourceDidFetchQuery(query);
        } else {
          store.dataSourceDidErrorQuery(query, result.responseDetails);
        }
      });
      return YES;
    }
    return NO;
  },

  /**
    Fetches the feed at the given url.
    @param {SC.Store} store The store that requested the record.
    @param {Number} storeKey The storeKey where the record is located.
    @param {String} id The URL of the feed to fetch.
   */
  retrieveRecord: function (store, storeKey, id) {
    var recordType = store.recordTypeFor(storeKey),
        key = this.get('apiKey');

    if (SC.guidFor(recordType) === SC.guidFor(RSS.Feed)) {
      $.getJSON(this.get('url') + 'load' +
                '?v=1.0' +
                '&q=' + id +
                '&key=' + key +
                '&num=-1' +
                '&hl=' + SC.Locale.currentLanguage +
                '&scoring=h' +
                '&callback=?', function (result) {
        if (result.responseStatus === 200) {
          store.dataSourceDidComplete(storeKey, result.responseData.feed, id);          
        } else {
          store.dataSourceDidError(storeKey, result.responseDetails, id);
        }
      });
      return YES;
    }
    return NO;
  },

  destroyRecord: function (store, storeKey) {
    var recordType = store.recordTypeFor(storeKey),
        uType = SC.guidFor(recordType);

    if (uType === SC.guidFor(RSS.Feed) ||
        uType === SC.guidFor(RSS.Entry)) {
      store.dataSourceDidDestroy(storeKey);
      return YES;
    }

    return NO;
  }
});
