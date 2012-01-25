// ==========================================================================
// Project:   ReadingList - mainPage
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed');

ReadingList.mainPage = SC.Page.design({
  mainPane: SC.MainPane.design({
    childViews: ['split'],

    split: SC.SplitView.design({
      dividerThickness: 1,
      canCollapseViews: NO,
      topLeftMinThickness: 250,
      topLeftView: ReadingList.FeedView,

      bottomRightView: ReadingList.CardView.design({
        contentBinding: SC.Binding.oneWay('ReadingList.entriesController*selection.firstObject').single(),
        exampleView: SC.View.design({
          classNames: ['scrollable'],
          childViews: [ReadingList.PageView.extend({
            contentBinding: SC.Binding.oneWay('.parentView.content'),
            parentFrameBinding: SC.Binding.oneWay('.parentView.frame'),
            layout: function () {
              var height = SC.getPath(this, 'parentFrame.height');
              height = height
                       ? height - 100
                       : 0;
              return { minHeight: height };
            }.property('parentFrame').cacheable()
          })]
        })
      })
    })
  })
});
