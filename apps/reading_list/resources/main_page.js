// ==========================================================================
// Project:   ReadingList - mainPage
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/reader');
require('views/editor');
require('views/card');

ReadingList.mainPage = SC.Page.design({
  editor: SC.outlet('mainPane.splitView.topLeftView.editor'),
  reader: SC.outlet('mainPane.splitView.topLeftView.reader'),
  feeds: SC.outlet('mainPane.splitView.topLeftView.reader.feeds'),
  entries: SC.outlet('mainPane.splitView.topLeftView.reader.entries'),

  mainPane: SC.MainPane.design({
    childViews: ['splitView'],

    splitView: SC.SplitView.design({
      dividerThickness: 1,
      canCollapseViews: NO,
      topLeftMinThickness: 400,
      defaultThickness: 400,
      topLeftView: SC.View.design({
        childViews: ['reader', 'editor', 'topToolbar', 'bottomToolbar'],
        classNames: ['reader'],

        // Here for styling purposes-
        // UI will be overlaid on top of this
        topToolbar: SC.ToolbarView.design({
          layout: { top: 0, height: 39, borderBottom: 1 }
        }),

        bottomToolbar: SC.ToolbarView.design({
          layout: { bottom: 0, height: 33, borderTop: 1 }
        }),

        reader: ReadingList.ReaderView.design({
          isVisible: YES
        }),
        editor: ReadingList.EditorView.design({
          isVisible: NO
        })
      }),

      bottomRightView: ReadingList.CardView.design({
        contentBinding: SC.Binding.oneWay('ReadingList.entriesController*selection.firstObject').single(),
        exampleView: ReadingList.PageView
      })
    })
  })
});
