// ==========================================================================
// Project:   ReadingList.EditorView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed_item');

ReadingList.EditorView = SC.View.extend({

  // Layout above toolbars
  layout: { zIndex: 11 },

  classNames: ['editor'],

  childViews: ['header', 'editor', 'footer'],

  header: SC.ToolbarView.design({
    themeName: 'matte-dark',
    classNames: ['header'],
    layout: { top: 0, height: 28 },
    childViews: ['label', 'selectAll'],

    label: SC.LabelView.design({
      layout: { centerY: 0, height: 20, left: 0, right: 0 },
      textAlign: SC.ALIGN_CENTER,
      classNames: ['title'],
      localize: YES,
      value: '_Remove feeds from your list'
    }),

    selectAll: SC.CheckboxView.design(SC.AutoResize, {
      themeName: 'dark',
      layout: { left: 27, height: 20, centerY: 0 },
      autoResizePadding: { width: 32 },
      localize: YES,
      title: '_Check All',
      valueBinding: 'ReadingList.editorController.areAllSelected'
    })
  }),

  editor: SC.ScrollView.design({
    layout: { top: 28, bottom: 33 },
    contentView: SC.ListView.design({
      rowHeight: 55,
      contentBinding: SC.Binding.oneWay('ReadingList.feedsController'),
      exampleView: SC.View.design({
        childViews: ['item', 'checkbox'],
        item: ReadingList.FeedItemView.design({
          contentBinding: SC.Binding.oneWay('.parentView.content'),
          layout: { left: 37 } /* 22 + 18 + 19 - 12 - 10*/
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
      isEnabledBinding: SC.Binding.oneWay('ReadingList.editorController.length').bool(),
      layout: { centerX: -68, width: 124, top: 3, height: 26, border: 1 },
      themeName: 'red',
      action: 'removeSelectedFeeds',
      titleBinding: SC.Binding.oneWay('ReadingList.editorController.length'),
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
      localize: YES,
      title: '_Cancel',
      action: 'cancel'
    })
  })
});
