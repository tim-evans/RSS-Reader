/** @class
  A simple tag view.

  This view can be embedded in a search view as
  a way to edit tags a lá a tag input field.

  @extends SC.View
  @see http://xoxco.com/projects/code/tagsinput/
 */
SC.TagView = SC.View.extend(
  /** @scope SC.TagView.prototype */{

  /**
    Use <span> tags as the wrapper.
    @type String
    @default 'span'
    @see SC.View#tagName
   */
  tagName: 'span',

  /**
    CSS class names to apply to this view.
    @type String[]
    @default ['tag']
    @see SC.View#classNames
   */
  classNames: ['tag'],

  /**
    The value of the tag.
    @type String
    @default null
   */
  value: null,

  /**
    The display value of the tag (localized)
    @field
    @type String
   */
  displayValue: function () {
    var value = this.get('value');
    if (value && this.getDelegateProperty('localize', this.displayDelegate)) {
      value = SC.String.loc(value);
    }
    return value;
  }.property('value', 'localize').cacheable(),

  /**
    Whether this is selected or not.
    @type Boolean
    @default NO
   */
  isSelected: NO,

  /**
    Whether this tag is editable or not.
    @type Boolean
    @default NO
   */
  isEditable: NO,

  /**
    Whether this view should be localized
    @type Boolean
    @default YES
   */
  localize: YES,

  /**
    Properties to trigger a view update on.
    @type String[]
    @default ['displayValue', 'isSelected']
    @see SC.View#displayProperties
   */
  displayProperties: ['displayValue', 'isSelected'],

  /** @private
    Renders the view (first time)
   */
  render: function (context) {
    context.push(this.get('displayValue'));
  },

  /** @private
    Updates the view.
   */
  update: function ($) {
    var K = 'TagView';

    $.setClass('sel', this.get('isSelected'));

    if (this.didChangeFor(K, 'displayValue')) {
      $.html(this.get('displayValue'));      
    }
  }

});
