// ==========================================================================
// Project:   ReadingList.FeedView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed_item');

ReadingList.FeedManagerView = SC.View.extend({

  classNames: ['manager'],

  childViews: ['header', 'manager', 'footer'],

  header: SC.ToolbarView.design({
    themeName: 'matte-dark',
    classNames: ['header'],
    layout: { top: 0, height: 28 },
    childViews: ['label', 'selectAll'],

    label: SC.LabelView.design(SC.AutoResize, {
      layout: { centerY: 0, height: 20, centerX: 0, width: 10 },
      classNames: ['title'],
      localize: YES,
      value: '_Remove feeds from your list'
    }),

    selectAll: SC.CheckboxView.design(SC.AutoResize, {
      themeName: 'dark',
      layout: { left: 27, height: 20, centerY: 0 },
      autoResizePadding: { width: 40 },
      title: '_Check All',
      valueBinding: 'ReadingList.feedManagerController.areAllSelected'
    })
  }),

  manager: SC.ScrollView.design({
    layout: { top: 28, bottom: 33 },
    contentView: SC.ListView.design({
      rowHeight: 55,
      contentBinding: SC.Binding.oneWay('ReadingList.feedController'),
      selectionBinding: 'ReadingList.feedController.selection',
      exampleView: SC.View.design({
        childViews: ['item', 'checkbox'],
        item: ReadingList.FeedItemView.design({
          contentBinding: SC.Binding.oneWay('.parentView.content'),
          layout: { left: 47 } /* 22 + 18 + 19 - 12 */
        }),
        checkbox: SC.CheckboxView.design({
          layout: { zIndex: 2 },
          themeName: 'remove',
          valueBinding: '.parentView.content.isSelected'
        })
      })
    })
  }),

  footer: SC.ToolbarView.design({
    layout: { bottom: 0, height: 33 },
    themeName: 'matte-dark',
    childViews: ['remove', 'cancel'],

    remove: SC.ButtonView.design({
      isEnabledBinding: SC.Binding.oneWay('ReadingList.feedManagerController.length').bool(),
      layout: { centerX: -68, width: 124, top: 3, height: 26, border: 1 },
      themeName: 'red',
      targetBinding: SC.Binding.oneWay('ReadingList.feedManagerController'),
      action: 'removeSelectedFeeds',
      titleBinding: SC.Binding.oneWay('ReadingList.feedManagerController.length'),
      displayTitle: function () {
        var title = this.get('title');

        return '_Remove (%@)'.loc(title > 99
                                  ? '_LOTS'.loc()
                                  : title);
      }.property('title').cacheable()
    }),

    cancel: SC.ButtonView.design({
      themeName: 'dark',
      layout: { centerX: 68, width: 124, top: 3, height: 26, border: 1 },
      title: '_Cancel'
    })
  })
});
