// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */
require('states/manager');
require('states/inbox');

/**
  A statechart to manage the UI and UI actions.

  @extends SC.Statechart
 */
ReadingList.statechart = SC.Statechart.create(
  /** @scope ReadingList.statechart */{

  trace: YES,

  autoinitStatechart: NO,

  initialState: 'inbox',

  inbox: SC.State.plugin('ReadingList.InboxState'),

  manager: SC.State.plugin('ReadingList.FeedManagerState')

});