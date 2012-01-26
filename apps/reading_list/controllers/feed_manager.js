// ==========================================================================
// Project:   ReadingList.feedManagerController
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */
require('controllers/feed');

/**
  A controller to manage the current feeds a user is
  subscribed to.

  This supports removing existing feeds.

  @extends SC.ArrayController
 */
ReadingList.feedManagerController = SC.ArrayController.create(
  /** @scope ReadingList.feedManagerController.prototype */{

  /**
    The content of this controller is every feed that has
    `isSelected` set to `YES`.
    @type RSS.Feed[]
    @default null
   */
  content: null,

  /**
    The total number of feeds that the user is subscribed to.
    @field
    @type Number
   */
  totalFeedsBinding: SC.Binding.oneWay('ReadingList.feedController.length'),

  /**
    Whether all feeds are currently selected in the manager.
    @field
    @type Boolean
    @default NO
   */
  areAllSelected: function (k, v) {
    if (v !== undefined) {
      ReadingList.feedController.setEach('isSelected', v);
    }
    return this.get('length') === this.get('totalFeeds');
  }.property('length', 'totalFeeds').cacheable()

});
