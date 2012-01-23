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
ReadingList.PageView = SC.View.extend(
  /** @scope ReadingList.PageView.prototype */{

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
    context.push('<h1>' + this.getPath('content.title') + '</h1>');
    context.push(this.getPath('content.content'));
  }

});
