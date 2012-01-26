// ==========================================================================
// Project:   ReadingList.FeedView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed_item');

/**
  A card that can be swiped in and out using gestures
  on touch devices and makes up items in a deck.
  @extend SC.View
 */
ReadingList.FeedView = SC.View.extend(
  /** @scope ReadingList.FeedView.prototype */{

  childViews: ['feeds', 'entries', 'topToolbar', 'bottomToolbar'],

  feeds: SC.ScrollView.design({
    layout: { top: 33, bottom: 33 },
    createChildViews: function () {
      sc_super();
      var view = this.createChildView(this.get('noFeedsView'));
      this.set('noFeedsView', view);
      this.childViews.unshiftObject(view);
    },

    noFeedsView: SC.LabelView.design({
      isVisibleBinding: SC.Binding.oneWay('ReadingList.feedController.length').not(),
      layout: { left: .15, right: .15, top: .15, zIndex: 2 },
      value: '_You currently have no feeds to read'
    }),

    contentView: SC.SourceListView.design({
      rowHeight: 55,
      contentBinding: SC.Binding.oneWay('ReadingList.feedController'),
      selectionBinding: 'ReadingList.feedController.selection',
      actOnSelect: YES,
      action: function () {
        var entries = this.getPath('parentView.parentView.parentView.entries'),
            feeds = this.getPath('parentView.parentView.parentView.feeds');
        feeds.set('isVisible', NO);
        entries.set('isVisible', YES);
      },
      exampleView: ReadingList.FeedItemView
    })
  }),

  entries: SC.ScrollView.design({
    isVisible: NO,
    layout: { top: 33, bottom: 33 },
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
      exampleView: SC.LabelView.design({
        needsEllipsis: YES,
        valueBinding: SC.Binding.oneWay('.content.title')
      })
    })
  }),

  topToolbar: SC.ToolbarView.design({
    layout: { top: 0, height: 33, borderBottom: 1 },
    childViews: ['back'],

    back: SC.ButtonView.design(SC.AutoResize, {
      themeName: 'medium',
      isEnabledBinding: SC.Binding.oneWay('.parentView.parentView.entries.isVisible'),
      title: '_Go Back',
      layout: { left: 10, top: 7, bottom: 5 },
      shouldResizeWidth: YES,
      autoResizePadding: {
        width: 36
      },
      action: function () {
        var entries = this.getPath('parentView.parentView.entries'),
            feeds = this.getPath('parentView.parentView.feeds');
        feeds.set('isVisible', YES);
        entries.set('isVisible', NO);
      }
    })
  }),

  bottomToolbar: SC.ToolbarView.design({
    layout: { bottom: 0, height: 33, borderTop: 1 },
    childViews: ['add', 'remove', 'thumb'],

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
      image: 'remove-button'
    }),

    thumb: SC.ThumbView.design({
      layout: { right: 0, width: 19 }
    })
  })

});
