// ==========================================================================
// Project:   ReadingList.FeedView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed_item');
require('views/entry_item');

/**
  A card that can be swiped in and out using gestures
  on touch devices and makes up items in a deck.
  @extend SC.View
 */
ReadingList.FeedView = SC.View.extend(
  /** @scope ReadingList.FeedView.prototype */{

  childViews: ['feeds', 'entries', 'topToolbar', 'bottomToolbar'],

  feeds: SC.ScrollView.design({
    layout: { top: 39, bottom: 33 },
    createChildViews: function () {
      sc_super();
      var view = this.createChildView(this.get('noFeedsView'));
      this.set('noFeedsView', view);
      this.childViews.unshiftObject(view);
    },

    noFeedsView: SC.LabelView.design({
      isVisibleBinding: SC.Binding.oneWay('ReadingList.feedController.length').not(),
      layout: { left: .15, right: .15, top: .15, zIndex: 2 },
      localize: YES,
      escapeHTML: NO,
      value: "_There's nothing to read."
    }),

    contentView: SC.SourceListView.design({
      rowHeight: 55,
      contentBinding: SC.Binding.oneWay('ReadingList.feedController'),
      selectionBinding: 'ReadingList.feedController.selection',
      actOnSelect: YES,
      target: 'ReadingList.statechart',
      action: 'viewEntries',
      exampleView: ReadingList.FeedItemView
    })
  }),

  entries: SC.ScrollView.design({
    isVisible: NO,
    layout: { top: 39, bottom: 33 },
    createChildViews: function () {
      sc_super();
      var view = this.createChildView(this.get('noEntriesView'));
      this.set('noEntriesView', view);
      this.childViews.unshiftObject(view);
    },

    noEntriesView: SC.LabelView.design({
      isVisibleBinding: SC.Binding.oneWay('ReadingList.feedController.length').not(),
      layout: { left: .15, right: .15, top: .15, zIndex: 2 },
      value: '_You currently have no feeds to read'
    }),

    contentView: SC.SourceListView.design({
      rowHeight: 55,
      contentBinding: SC.Binding.oneWay('ReadingList.entriesController'),
      selectionBinding: 'ReadingList.entriesController.selection',
      exampleView: ReadingList.EntryItemView
    })
  }),

  topToolbar: SC.ToolbarView.design({
    layout: { top: 0, height: 39, borderBottom: 1 },
    childViews: ['back', 'title'],

    back: SC.ButtonView.design(SC.AutoResize, {
      themeName: 'medium',
      isVisibleBinding: SC.Binding.oneWay('.parentView.parentView.entries.isVisible'),
      isEnabledBinding: SC.Binding.oneWay('.parentView.parentView.entries.isVisible'),
      localize: YES,
      title: '_Back',
      layout: { left: 10, top: 7, bottom: 5 },
      shouldResizeWidth: YES,
      autoResizePadding: {
        width: 36
      },
      target: 'ReadingList.statechart',
      action: 'viewFeeds'
    }),

    title: SC.LabelView.design(SC.AutoResize, {
      layout: { top: 7, bottom: 5, centerX: 0 },
      isVisibleBinding: SC.Binding.oneWay('.parentView.parentView.entries.isVisible'),
      valueBinding: SC.Binding.oneWay('ReadingList.feedController*selection.firstObject.title')
    })
  }),

  bottomToolbar: SC.ToolbarView.design({
    layout: { bottom: 0, height: 33, borderTop: 1 },
    childViews: ['add', 'remove', 'menu', 'thumb'],

    add: SC.ImageButtonView.design({
      themeName: 'pill',
      layout: { left: 10, width: 32, top: 7, bottom: 5 },
      image: 'add-button',
      target: 'ReadingList.feedController',
      action: 'addFeed'
    }),

    remove: SC.ImageButtonView.design({
      themeName: 'pill',
      layout: { left: 42, width: 32, top: 7, bottom: 5 },
      image: 'remove-button',
      isEnabledBinding: SC.Binding.oneWay('ReadingList.feedController.length').bool(),
      target: 'ReadingList.statechart',
      action: 'manageFeeds'
    }),

    menu: SC.SelectView.design({
      themeName: 'pill',
      layout: { left: 74, width: 42, top: 7, bottom: 5 },
      image: 'menu-button',
      items: ['Help', 'Show icons?']
    }),

    thumb: SC.ThumbView.design({
      layout: { right: 0, width: 19 }
    })
  })

});
