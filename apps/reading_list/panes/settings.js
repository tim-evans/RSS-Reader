ReadingList.SettingsPane = SC.PanelPane.extend({
  layout: { width: 400, height: 100, centerX: 0, centerY: -50 },
  themeName: 'dark',
  delegate: null,

  contentView: SC.View.design({
    childViews: ['title', 'showIcons', 'done'],
    title: SC.LabelView.design(SC.AutoResize, {
      classNames: ['title'],
      layout: { left: 12, top: 12, height: 24 },
      localize: YES,
      value: '_Settings'
    }),

    showIcons: SC.CheckboxView.design(SC.AutoResize, {
      layout: { left: 12, height: 24, top: 48 },
      autoResizePadding: { width: 22 },
      localize: YES,
      title: '_Show feed icons',
      valueBinding: '.pane.delegate*showIcons'
    }),

    done: SC.ButtonView.design(SC.AutoResize, {
      layout: { bottom: 12, right: 12, height: 26, border: 1 },
      localize: YES,
      title: '_Done',
      action: 'finishEditing'
    })
  })
});
