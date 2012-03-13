// ==========================================================================
// Project:   ReadingList.ReaderView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/entry_item');

ReadingList.EntryView = SC.View.extend({

  childViews: ['header', 'content', 'footer'],

  header: SC.View.design({
    layout: { top: 0, height: 38, zIndex: 11 },
    childViews: ['back', 'title'],
    classNames: ['toolbar'],

    back: SC.ButtonView.design(SC.AutoResize, {
      themeName: 'medium',
      localize: YES,
      title: '_Back',
      layout: { left: 10, top: 7, bottom: 5 },
      shouldResizeWidth: YES,
      action: 'browseFeeds'
    }),

    title: SC.LabelView.design(SC.AutoResize, {
      classNames: ['title'],
      layout: { top: 7, bottom: 5, centerX: 0 },
      valueBinding: SC.Binding.oneWay('ReadingList.feedController.title')
    })
  }),

  content: SC.ScrollView.design({
    layout: { top: 39, bottom: 33 },

    createChildViews: function () {
      sc_super();
      var view = this.createChildView(this.get('noEntriesView'));
      this.set('noEntriesView', view);
      this.childViews.unshiftObject(view);
    },

    noEntriesView: SC.LabelView.design({
      isVisibleBinding: SC.Binding.oneWay('ReadingList.feedsController.length').not(),
      layout: { left: .15, right: .15, top: .15, zIndex: 2 },
      value: '_You currently have no feeds to read'
    }),

    contentView: SC.SourceListView.design({
      layout: { top: 0, left: 0, right: 0, bottom: 0 },
      rowHeight: 55,
      contentBinding: SC.Binding.oneWay('ReadingList.entriesController'),
      selectionBinding: 'ReadingList.entriesController*selection',
      exampleView: ReadingList.EntryItemView
    })
  }),

  footer: SC.View.design({
     layout: { bottom: 0, height: 32, zIndex: 11 }
  })
});
