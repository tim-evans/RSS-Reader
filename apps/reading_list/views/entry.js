// ==========================================================================
// Project:   ReadingList.ReaderView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/entry_item');
require('views/refresher');

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
      isVisibleBinding: SC.Binding.oneWay('ReadingList.entriesController.length').not(),
      layout: { left: .15, right: .15, top: .15, zIndex: 2 },
      localize: YES,
      value: "_There's nothing to read."
    }),

    contentView: SC.SourceListView.design({
      layout: { top: 0, left: 0, right: 0, bottom: 0 },
      rowHeight: 55,
      contentDelegate: SC.outlet('entriesController', ReadingList),
      rowDelegate: SC.outlet('entriesController', ReadingList),
      contentBinding: SC.Binding.oneWay('ReadingList.entriesController.arrangedObjects'),
      selectionBinding: 'ReadingList.entriesController*selection',
      rowSpacing: 1,
      exampleView: ReadingList.EntryItemView,
      groupExampleView: SC.LabelView.design({
        localize: YES,
        valueBinding: SC.Binding.oneWay('.content')
      })
    })
  }),

  footer: SC.View.design({
    layout: { bottom: 0, height: 32, zIndex: 11 },
    classNames: ['toolbar'],
    childViews: ['refresher'],

    refresher: ReadingList.RefresherView.design({
      action: 'refresh',
      lastUpdatedBinding: SC.Binding.oneWay('ReadingList.feedController*lastUpdated')
    })
  })
});
