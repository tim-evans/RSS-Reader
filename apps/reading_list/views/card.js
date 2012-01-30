// ==========================================================================
// Project:   ReadingList.CardView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */

/**
  @extends SC.View
 */
ReadingList.CardView = SC.View.extend(
  /** @scope ReadingList.CardView.prototype */{

  contentDidChange: function () {
    var content = this.get('content'),
        contentView = this.get('exampleView'),
        view = this, View;

    View = contentView.extend({
      wantsAcceleratedLayer: YES,
      content: content,
      layout: {
        left: -1 * SC.getPath(view, 'frame.width'),
        right: SC.getPath(view, 'frame.width')
      }
    });

    if (content != null) {
      view = this.createChildView(View);
      this.set('contentView', view);
      this.replaceAllChildren([view]);
      setTimeout(function () {
        view.animate({
          left: 0,
          right: 0
        }, {
          timing: 'ease-out',
          duration: .25
        });
      }, 0);
    } else {
      view = this.get('contentView');
      view.animate({
        left: -1 * SC.getPath(view, 'frame.width'),
        right: SC.getPath(view, 'frame.width')
      }, {
        timing: 'ease-out',
        duration: .25
      }, function () {
        view.destroy();
      });
    }
  }.observes('content')

});
