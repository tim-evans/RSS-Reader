// ==========================================================================
// Project:   ReadingList - mainPage
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed');
require('views/editor');
require('views/card');

ReadingList.mainPage = SC.Page.design({
  lists: SC.outlet('mainPane.splitView.topLeftView.feedView'),
  feeds: SC.outlet('mainPane.splitView.topLeftView.feedView.feeds'),
  entries: SC.outlet('mainPane.splitView.topLeftView.feedView.entries'),
  editor: SC.outlet('mainPane.splitView.topLeftView.editor'),

  mainPane: SC.MainPane.design({
    childViews: ['splitView'],

    splitView: SC.SplitView.design({
      dividerThickness: 1,
      canCollapseViews: NO,
      topLeftMinThickness: 400,
      defaultThickness: 400,
      topLeftView: SC.View.design({
        feedView: ReadingList.FeedView.design({
        childViews: ['feedView', 'editor'],
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
