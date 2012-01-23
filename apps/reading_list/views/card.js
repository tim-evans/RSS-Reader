// ==========================================================================
// Project:   ReadingList.CardView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */

/**
  A card that can be swiped in and out using gestures
  on touch devices and makes up items in a deck.
  @extend SC.View
 */
ReadingList.CardView = SC.View.extend(
  /** @scope ReadingList.CardView.prototype */{

  childViews: ['contentView']

});
