SC.SearchCriterionView = SC.View.extend(
  /** @scope SC.SearchCriterionView.prototype */{

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
    @default ['criterion']
    @see SC.View#classNames
   */
  classNames: ['criterion'],

  /**
    The type of the search criterion.
    @type String
    @default null
   */
  type: null,

  /**
    The value of the search criterion.
    @type String
    @default null
   */
  value: null,

  /**
    Whether this is selected or not.
    @type
    @default null
   */
  isSelected: null,

  /**
    A pill has two parts to render
    and will be styled to note that the
    two parts are related.
    @type String
    @default 'pill'
   */
  themeName: 'pill',

  /**
    The display value of the criteria (localized)
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
    The display type of the criteria (localized)
    @field
    @type String
   */
  displayType: function () {
    var value = this.get('type');
    if (value && this.getDelegateProperty('localize', this.displayDelegate)) {
      value = SC.String.loc(value);
    }
    return value;
  }.property('type', 'localize').cacheable(),

  /**
    Properties to trigger a view update on.
    @type String[]
    @default ['isSelected', 'displayType', 'displayValue']
    @see SC.View#displayProperties
   */
  displayProperties: ['isSelected', 'displayType', 'displayValue'],

  render: function (context) {
    context.push('<span class="head">' + this.get('displayType') + '</span>');
    context.push('<span class="tail">' + this.get('displayValue') + '</span>');
  },

  update: function ($) {
    var K = 'SearchCriterionView';

    $.setClass('sel', this.get('isSelected'));

    if (this.didChangeFor(K, 'displayType')) {
      $.find('.head').html(this.get('displayType'));
    }

    if (this.didChangeFor(K, 'displayValue')) {
      $.find('.tail').html(this.get('displayValue'));
    }
  }

});
