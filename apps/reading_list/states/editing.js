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

    setTimeout(function () {
      SC.run(function () {
        // Translate 100% up
        editor.animate({
          top: 0,
          bottom: 0
        }, {
          timing: 'ease-out',
          duration: .25
        });
      });
    }, 0);

    // Reset selection
    ReadingList.editorController.setEach('isSelected', NO);
  },

  exitState: function () {
    var editor = ReadingList.mainPage.get('editor');

    setTimeout(function () {
      SC.run(function () {
        // Translate 100% down
        editor.animate({
          top: editor.get('frame').height,
          bottom: -1 * editor.get('frame').height
        }, {
          timing: 'ease-out',
          duration: .25
        }, function () {
          editor.set('isVisible', NO);
        });
      });
    }, 0);
  },

  removeSelectedFeeds: function () {
    ReadingList.editorController.invoke('destroy');
    this.gotoState('reading');
  },

  cancel: function () {
    this.gotoState('reading');
  }
});
