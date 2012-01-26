// ==========================================================================
// Project:   ReadingList - mainPage
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed');
require('views/card');

ReadingList.mainPage = SC.Page.design({
  mainPane: SC.MainPane.design({
    childViews: ['split'],

    split: SC.SplitView.design({
      dividerThickness: 1,
      canCollapseViews: NO,
      topLeftMinThickness: 400,
      defaultThickness: 400,
      topLeftView: ReadingList.FeedView,

      bottomRightView: ReadingList.CardView.design({
        contentBinding: SC.Binding.oneWay('ReadingList.entriesController*selection.firstObject').single(),
        exampleView: ReadingList.PageView
      })
    })
  })
});
