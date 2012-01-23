ReadingList.AddFeedPane = SC.PickerPane.extend({
  themeName: 'popover',
  layout: { width: 400, height: 100 },
  pointerOffset: [0, 0, 0],
  action: null,

  contentView: SC.View.design({
    childViews: ['label', 'field', 'addFeedButton', 'goBack'],
    label: SC.LabelView.design({
      value: '_Add a feed'
    }),

    field: SC.TextFieldView.design({
      hint: '_Enter a RSS Feed URL',
      layout: { left: 0, right: 0, height: 28, top: 50 },
      applyImmediately: YES
    }),

    addFeedButton: SC.ButtonView.design({
      title: '_Add Feed',
      layout: { bottom: 0, left: 6, width: 188, height: 26 },
      valueBinding: SC.Binding.oneWay('.parentView.field.value'),
      action: function () {
        this.getPath('parentView.parentView').tryToPerform('action', this);
        this.getPath('parentView.parentView').remove();
      }
    }),

    goBack: SC.ButtonView.design({
      title: '_Go Back',
      layout: { bottom: 0, right: 6, width: 188, height: 26 },
      targetBinding: SC.Binding.oneWay('.parentView.parentView'),
      action: 'remove'
    })
  })
});
