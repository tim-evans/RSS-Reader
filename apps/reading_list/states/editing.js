// ==========================================================================
// Project:   ReadingList
// Copyright: @2012 SproutCore, Tim Evans
// ==========================================================================
/*globals ReadingList */

ReadingList.EditingState = SC.State.extend(
  /** @scope ReadingList.EditingState.prototype */{

  enterState: function () {
    var editor = ReadingList.mainPage.get('editor');

    editor.set('isVisible', YES);
    editor.adjust({ top: editor.getPath('frame').height,
                    bottom: -1 * editor.getPath('frame').height });

    ReadingList.scheduleAnimation(editor, function () {
      // Translate 100% up
      editor.animate({
        top: 0,
        bottom: 0
      }, {
        timing: ReadingList.TIMING,
        duration: ReadingList.DURATION
      });
    });

    // Reset selection
    ReadingList.editorController.setEach('isSelected', NO);
  },

  exitState: function () {
    var editor = ReadingList.mainPage.get('editor');

    ReadingList.scheduleAnimation(editor, function () {
      // Translate 100% down
      editor.animate({
        top: editor.get('frame').height,
        bottom: -1 * editor.get('frame').height
      }, {
        timing: ReadingList.TIMING,
        duration: ReadingList.DURATION
      }, function () {
        editor.set('isVisible', NO);
      });
    });
  },

  removeSelectedFeeds: function () {
    ReadingList.editorController.invoke('destroy');
    this.gotoState('reading');
  },

  cancel: function () {
    this.gotoState('reading');
  }
});
