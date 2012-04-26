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

  TIMING: 'ease-out',
  DURATION: .2,

  _buffer: [],

  scheduleAnimation: function (view, callback) {
    var self = this,
        bufLen = this._buffer.length;

    this._buffer.push(callback);
    if (!bufLen) {
      setTimeout(function () {
        // Chrome workaround;
        // Breaks up the repaint buffer
        view.get('layer').offsetHeight;

        SC.run(function () {
          var buffer = self._buffer,
              len = buffer.length,
              i;

          for (i = 0; i < len; i++) {
            buffer[i]();
          }
        });
        self._buffer = [];
      }, 0);
    }
  },

  store: SC.Store.create().from(
    RSS.DataSource.create({
      apiKey: 'ABQIAAAADlwE3RKFzEtkSuR_WUnTHxStcdMUtx7eZCS9OGF3zYmEWzqo3RQl4N-hJK1M0G2fLgD48F8PYB82hg'
    }))
});
