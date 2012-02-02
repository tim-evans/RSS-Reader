// ==========================================================================
// Project:   ReadingList.PageView
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */

/**
  A page renders the contents of an entry in the reading
  list in an unobtrusive way. It has controls for changing
  font sizes and serifs.
  @extend SC.ScrollView
 */
ReadingList.PageView = SC.ScrollView.design(
  /** @scope ReadingList.PageView.prototype */{

  contentView: SC.View.design({

    classNames: ['page'],

    useStaticLayout: YES,

    /**
      The page's text should be selectable.
      @type Boolean
      @default YES
     */
    isTextSelectable: YES,

    displayProperties: ['content'],

    render: function (context) {
      var esc = SC.RenderContext.escapeHTML;

      context = context.begin('div');
      context.addClass('header');

      context.push('<h1>' + esc(this.getPath('content.title')) + '</h1>');
      context.push('<small>' + esc(this.getPath('content.author.fullName')) + '</small>');

      context = context.begin('span');
      context.addClass('categories');
      (this.getPath('content.categories') || []).forEach(function (v) {
        context.push('<span class="ace reading-list tag">', v.get('value'), '</span>');
      });
      context = context.end();
      context = context.end();
      context.push(this.getPath('content.content'));
    },

    contentBinding: SC.Binding.oneWay('.parentView.parentView.content'),

    parentFrameBinding: SC.Binding.oneWay('.parentView.parentView.frame'),

    layout: function () {
      var height = SC.getPath(this, 'parentFrame.height');
      height = height
               ? height - 100
               : 0;
      return { minHeight: height };
    }.property('parentFrame').cacheable()

  })
});
