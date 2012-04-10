// ==========================================================================
// Project:   ReadingList.FeedView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed_item');

ReadingList.FeedView = SC.View.extend({

  childViews: ['header', 'content', 'footer'],

  header: SC.View.design({
    layout: { top: 0, height: 38, zIndex: 11 },
    childViews: ['title'],
    classNames: ['toolbar'],

    title: SC.LabelView.design(SC.AutoResize, {
      classNames: ['title'],
      layout: { top: 7, bottom: 5, centerX: 0 },
      localize: YES,
      value: '_My Feeds'
    })
  }),

  content: SC.ScrollView.design({
    layout: { top: 39, bottom: 33 },

    createChildViews: function () {
      sc_super();
      var view = this.createChildView(this.get('noFeedsView'));
      this.set('noFeedsView', view);
      this.childViews.unshiftObject(view);
    },

    noFeedsView: SC.LabelView.design({
      isVisibleBinding: SC.Binding.oneWay('ReadingList.feedsController.length').not(),
      layout: { left: .15, right: .15, top: .15, zIndex: 2 },
      localize: YES,
      escapeHTML: NO,
      value: "_There's nothing to read."
    }),

    contentView: SC.SourceListView.design({
      rowHeight: 55,
      contentBinding: SC.Binding.oneWay('ReadingList.feedsController'),
      selectionBinding: 'ReadingList.feedsController.selection',
      action: 'browseEntries',
      exampleView: ReadingList.FeedItemView
    })
  }),

  footer: SC.View.design({
    layout: { bottom: 0, height: 32, zIndex: 11 },
    childViews: ['add', 'remove', 'menu'],
    classNames: ['toolbar'],

    add: SC.ImageButtonView.design({
      themeName: 'pill',
      layout: { left: 10, width: 32, top: 7, bottom: 5 },
      image: 'add-button',
      action: 'addFeed'
    }),

    remove: SC.ImageButtonView.design({
      themeName: 'pill',
      layout: { left: 42, width: 32, top: 7, bottom: 5 },
      image: 'remove-button',
      isEnabledBinding: SC.Binding.oneWay('ReadingList.feedsController.length').bool(),
      action: 'editFeeds'
    }),

    menu: SC.ImageButtonView.design({
      themeName: 'pill',
      layout: { left: 74, width: 42, top: 7, bottom: 5 },
      image: 'menu-button',
      action: 'configureSettings'
    })
  })
});
