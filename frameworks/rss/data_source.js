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

    if (SC.guidFor(recordType) === SC.guidFor(RSS.Entry) &&
        query.conditions) {
      $.getJSON(this.get('url') + 'find' +
                '?v=1.0' +
                '&q=' + query.conditions.query +
                '&key=' + key +
                '&num=-1' +
                '&hl=' + SC.Locale.currentLanguage +
                '&callback=?', function (result) {
        SC.run(function () {
          if (result.responseStatus === 200) {
            var storeKeys = store.loadRecords(RSS.Entry, result.responseData.entries);
            store.loadQueryResults(query, storeKeys);
            store.dataSourceDidFetchQuery(query);
            self.extractMetadata(store, result.responseData.entries);

          } else {
            store.dataSourceDidErrorQuery(query, result.responseDetails);
          }
        });
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
        key = this.get('apiKey'),
        self = this;

    if (SC.guidFor(recordType) === SC.guidFor(RSS.Feed)) {
      $.getJSON(this.get('url') + 'load' +
                '?v=1.0' +
                '&q=' + id +
                '&key=' + key +
                '&num=-1' +
                '&hl=' + SC.Locale.currentLanguage +
                '&scoring=h' +
                '&callback=?', function (result) {
        SC.run(function () {
          if (result.responseStatus === 200) {
            store.dataSourceDidComplete(storeKey, result.responseData.feed, id);
            self.extractMetadata(store, result.responseData.feed.entries);

          } else {
            store.dataSourceDidError(storeKey, result.responseDetails, id);
          }
        });
      });
      return YES;
    }
    return NO;
  },

  extractMetadata: function (store, entries) {
    var len = entries.length,
        i, j,
        entry,
        categories,
        category,
        author;

    for (i = 0; i < len; i++) {
      entry = entries[i];

      // Extract categories
      categories = [];
      for (j = 0; j < entry.categories.length; j++) {
        category = store.readDataHash(
                     store.storeKeyFor(
                       RSS.Category, entry.categories[j])) ||
                   { value: entry.categories[j],
                     entries: [] };

        category.entries.push(entry.link);
        categories.push(category);
      }
      store.loadRecords(RSS.Category, categories);

      // Extract authors
      author = store.readDataHash(
                 store.storeKeyFor(
                   RSS.Author, entry.author)) ||
               { value: entry.author,
                 entries: [] };

      author.entries.push(entry.link);
      store.pushRetrieve(RSS.Author, entry.author, author);
    }
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
