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

  childViews: ['list', 'toolbar'],

  list: SC.ScrollView.design({
    layout: { top: 0, bottom: 33 },
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
      exampleView: ReadingList.FeedItemView.design({
        needsEllipsis: YES,
        countBinding: SC.Binding.oneWay('.content.entries.length'),
        iconBinding: SC.Binding.oneWay('.content.link').transform(
          function (url) {
            return url + '/favicon.ico';
          }),
        titleBinding: SC.Binding.oneWay('.content.title'),
        authorBinding: SC.Binding.oneWay('.content.author'),
        descriptionBinding: SC.Binding.oneWay('.content.description'),
        detail: function () {
          return this.get('author') || this.get('description');
        }.property('author', 'description').cacheable()
      })
    })
  }),

  toolbar: SC.ToolbarView.design({
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
