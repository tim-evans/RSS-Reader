// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */

/**
  A statechart to manage the UI and UI actions.

  @extends SC.Statechart
 */
ReadingList.statechart = SC.Statechart.create(
  /** @scope ReadingList.statechart */{

  trace: YES,

  autoinitStatechart: NO,

  initialState: 'reading',

  reading: SC.State.plugin('ReadingList.ReadingState'),

  editing: SC.State.plugin('ReadingList.EditingState')

});
