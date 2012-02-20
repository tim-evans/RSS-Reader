ReadingList.AddFeedPane = SC.PickerPane.extend({
  themeName: 'dark',
  layout: { width: 400, height: 150 },
  pointerOffset: [0, 0, 0],
  action: null,

  contentView: SC.View.design({
    childViews: ['label', 'field', 'addFeedButton', 'goBack'],
    label: SC.LabelView.design({
      value: '_Add a feed',
      localize: YES,
      layout: { top: 12, left: 12, right: 12, height: 28 }
    }),

    field: SC.TextFieldView.design({
      hint: '_Enter a RSS Feed URL',
      layout: { left: 12, right: 12, height: 28, top: 50 },
      applyImmediately: YES,
      didAppendToDocument: function () {
        this.invokeLast('becomeFirstResponder');
      }
    }),

    addFeedButton: SC.ButtonView.design({
      themeName: 'blue',
      title: '_Add feed',
      localize: YES,
      isDefault: YES,
      layout: { bottom: 12, left: 12, width: 182, height: 26, border: 1 },
      valueBinding: SC.Binding.oneWay('.parentView.field.value'),
      action: function () {
        this.getPath('parentView.parentView').tryToPerform('action', this);
        this.getPath('parentView.parentView').remove();
      }
    }),

    goBack: SC.ButtonView.design({
      title: '_Go Back',
      localize: YES,
      layout: { bottom: 12, right: 12, width: 182, height: 26, border: 1 },
      targetBinding: SC.Binding.oneWay('.parentView.parentView'),
      action: 'remove'
    })
  })
});
