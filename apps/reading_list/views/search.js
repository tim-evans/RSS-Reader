ReadingList.SearchCriterionView = SC.View.extend(
  /** @scope ReadingList.SearchCriterionView.prototype */{

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

  render: function (context) {
    context.push('<span class="head">' + this.get('type').loc() + '</span>');
    context.push('<span class="tail">' + this.get('value').loc() + '</span>');
  },

  update: function ($) {
    $.setClass('isSelected', this.get('isSelected'));

    if (this.didChangeFor(K, 'type')) {
      $.find('.head').html(this.get('type'));
    }

    if (this.didChangeFor(K, 'value')) {
      $.find('.tail').html(this.get('value'));
    }
  }

});

ReadingList.SearchView = SC.View.extend(
  /** @scope ReadingList.SearchView.prototype */{

  /** @private
    Lazily instantiate variables here.
   */
  init: function () {
    this.set('conditions', []);
    return sc_super();
  },

  childViews: ['criterion', 'field'],

  /**
    The conditions that this field has.
    @type Hash
    @default null
   */
  conditions: null,

  /**
    A list of suggestions to show when the user
    begins typing. This should be bound in by the
    instantiating view.
    @type Hash[]
    @default null
   */
  suggestions: null,

  /**
    The search criterion that the user has provided.
    @extend SC.CollectionView
   */
  criterion: SC.CollectionView.design({
    contentBinding: SC.Binding.oneWay('.parentView*conditions'),
    exampleView: ReadingList.SearchCriterionView.design({
      useStaticLayout: YES,
      typeBinding: '*content.type',
      valueBinding: '*content.value'
    })
  }),

  field: SC.TextFieldView.design({

    /**
      Whether or not any conditions are being applied at
      the moment.
      @type Boolean
     */
    hasConditionsBinding: SC.Binding.oneWay('.parentView*conditions.length').bool(),

    /**
      The placeholder hint to show when there is no text /
      nothing being filtered on.
      @field
      @type String
     */
    hint: function () {
      return this.get('hasConditions')
             ? ''
             : '_Click to start searching';
    }.property('hasConditions').cacheable(),

    keyDown: function (evt) {
      var code = evt.commandCodes()[0],
          key = (evt.which === SC.Event.KEY_RETURN)
                ? 'return'                
                : String.fromCharCode(evt.which);

      // Deal with IME input
      if (evt.isIMEInput && key === 'return' && this.get('value') !== '') {
        var value = this.get('value'),
            uniComma = String.fromCharCode(12289), // Japanese / Mandarin comma
            idx;

        while ((idx = value.indexOf(uniComma)) !== -1) {
          this.get('parentView').createSearchCriterion(value.slice(0, idx));
          value = value.slice(idx + 1);
        }
        this.set('value', value);
        return YES;
      }

      // Forward any event that matches the specified
      // key pattern to the popup suggestion pane
      if (ReadingList.SearchView.PANE_KEYS.indexOf(code) !== -1) {
        var pane = this.getPath('parentView.pane');
        if (pane && pane.get('isPaneAttached')) {
          return pane.keyDown(evt);
        }
      }

      if (ReadingList.SearchView.SEPARATORS.indexOf(evt.which) !== -1) {
        this.get('parentView').createSearchCriterion(this.get('value'));
        this.set('value', '');
        evt.preventDefault();
        evt.stopPropagation();
        return YES;

      // Forward any event that matches the specified key pattern
      // when at the beginning of the text field OR the text field's empty
      } else if (ReadingList.SearchView.FORWARDING_KEYS.indexOf(code) !== -1 &&
                 (this.get('value') === '' ||
                 (this.get('cursorPosition') === 0 && this.get('textSelectionLength')))) {
        this.get('parentView').becomeFirstResponder();
        return this.get('parentView').keyDown(evt);
      }

      return sc_super();
    }

  }),

  createSearchCriterion: function (text) {
    this.get('conditions').pushObject(SC.Object.create({
      type: '_Any',
      value: text
    }));
  },

  keyDown: function (evt) {
    var code = evt.commandCodes()[0];

    switch (code) {
    // Select previous search criterion
    case 'left':
    case 'ctrl_b':
      break;
    // Select next search criterion or focus the text field
    case 'right':
    case 'ctrl_f':
      break;
    // Select the first search criterion
    case 'ctrl_a':
      break;
    // Select the last search criterion
    case 'ctrl_e':
      break;
    // Backward-delete one search criterion
    case 'backspace':
      break;
    // Forward-delete one search criterion
    case 'delete':
    case 'ctrl_d':
      break;
    // Kill all search criteria after the focused criterion
    case 'ctrl_k':
      break;
    }
  }
});

ReadingList.SearchView.mixin(
  /** @scope ReadingList.SearchView */{

  SEPARATORS: [44, 1548], // ',' and Arabic comma
  FORWARDING_KEYS: ['left', 'meta_b', 'ctrl_b', 'ctrl_a', 'meta_a', 'backspace'],
  PANE_KEYS: ['up', 'down', 'return']
});
