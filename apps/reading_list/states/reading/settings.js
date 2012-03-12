// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */

ReadingList.FeedSettingsState = SC.State.extend({

  pane: null,

  enterState: function () {
    if (!this.pane) {
      this.pane = ReadingList.SettingsPane.create({
        delegate: ReadingList.settingsController,
        defaultResponder: ReadingList.statechart
      });
    }
    this.pane.append();
  },

  finishEditing: function () {
    this.gotoState(this.getPath('parentState.browsing'));
  },

  exitState: function () {
    this.pane.remove();
  }
});
