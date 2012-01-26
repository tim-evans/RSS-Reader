require('theme');

ReadingList.Theme.thumbRenderDelegate = SC.RenderDelegate.create({

  render: function (dataSource, context) {
    context.push('<span class="gripper"></span>');
  },

  update: SC.K

});

SC.ThumbView.reopen({
  renderDelegateName: 'thumbRenderDelegate'
});