// ==========================================================================
// Project:   ReadingList - mainPage
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed');
require('views/feed_manager');
require('views/card');

ReadingList.mainPage = SC.Page.design({
  mainPane: SC.MainPane.design({
    childViews: ['splitView'],

    splitView: SC.SplitView.design({
      dividerThickness: 1,
      canCollapseViews: NO,
      topLeftMinThickness: 400,
      defaultThickness: 400,
      topLeftView: SC.View.design({
        childViews: ['feedView', 'managerView'],
        feedView: ReadingList.FeedView.design({
          isVisible: YES
        }),
        managerView: ReadingList.FeedManagerView.design({
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
