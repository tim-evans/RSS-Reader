ReadingList.SearchCriterionView = SC.View.extend(
  /** @scope ReadingList.SearchCriterionView.prototype */{

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
    this.set('content', []);

    var parent = this;
    this.get('exampleView').reopen({
      useStaticLayout: YES,
      didAppendToDocument: function () {
        var view = this;
        parent.invokeLast(function () {
          this.didCreateItem(view);
        });
      },
      willDestroyLayer: function () {
        parent.willDestroyItem(this);
      }
    });

    return sc_super();
  },

  /**
    The CSS class names to apply to this view.
    @type String[]
    @default ['search-field']
    @see SC.View#classNames
   */
  classNames: ['search-field'],

  /**
    The list of items and the text field
    that will be used to create the items.
    @type String[]
    @default ['items', 'field']
    @see SC.View#childViews
   */
  childViews: ['items', 'field'],

  /**
    The content to be rendered by this field.
    @type Hash
    @default null
   */
  content: null,

  /**
    A list of suggestions to show when the user
    begins typing. This should be bound in by the
    instantiating view.
    @type Hash[]
    @default null
   */
  suggestions: null,

  /**
    The padding between items.
    @type Number
    @default 4
   */
  padding: 4,

  /**
    Whether commas should be used to delimit items
    @type Boolean
    @default YES
   */
  useCommasAsDelimiters: YES,

  /**
    The hint to show when there is nothing provided as input.
    @type String
    @default
   */
  hint: '_Click to start searching',

  /**
    The example view to use when rendering the items in this field.
    @type SC.View
   */
  exampleView: ReadingList.SearchCriterionView.design({
    typeBinding: '*content.type',
    valueBinding: '*content.value'
  }),

  /**
    The search criterion that the user has provided.
    @extend SC.CollectionView
   */
  items: SC.CollectionView.design({
    layout: { height: 26 },
    contentBinding: SC.Binding.oneWay('.parentView*content'),
    exampleView: SC.outlet('parentView.exampleView')
  }),

  /** @private
    Called when an item is appended to the document.
   */
  didCreateItem: function (view) {
    var field = this.get('field'),
        layout = field.get('layout'),
        width = view.$().outerWidth();

    field.adjust('left', layout.left + width + this.get('padding'));
    view._width = width;
    this.invokeLast(this._sv_adjustScrollOffset);
  },

  /** @private
    Called when an item will be removed from the document.
   */
  willDestroyItem: function (view) {
    var field = this.get('field'),
        layout = field.get('layout'),
        width = view._width;

    field.adjust('left', layout.left - width - this.get('padding'));
    this.invokeLast(this._sv_adjustScrollOffset);
  },

  _sv_adjustScrollOffset: function () {
    var width = this.get('frame').width,
        layout = this.getPath('field.layout'),
        padding = this.get('padding');

    if ((layout.left + layout.width) > width) {
      this.$().scrollLeft(layout.left - width + layout.width + padding);
    }
  },

  field: SC.TextFieldView.design(SC.AutoResize, {

    /**
      Ignore changes in height.
      @type Boolean
      @default NO
     */
    autoResizeHeight: NO,

    /**
      This should be disabled the first time the view gets rendered.
      @type Boolean
      @default NO
     */
    shouldAutoResize: NO,

    /**
      Update `value` immediately.
      @type Boolean
      @default YES
     */
    applyImmediately: YES,

    /**
      Whether the hint should be showing.
      @type Boolean
     */
    shouldShowHintBinding: SC.Binding.oneWay('.parentView*content.length').bool().not(),

    /** @private */
    _hintBinding: SC.Binding.oneWay('.parentView.hint'),

    /**
      The placeholder hint to show when there is no text /
      nothing being filtered on.
      @field
      @type String
     */
    hint: function () {
      return this.get('shouldShowHint')
             ? this.get('_hint')
             : '';
    }.property('shouldShowHint', '_hint').cacheable(),

    /**
      Fix for auto resize text fields;
      ' ' should be replaced with '&nbsp;'

      @field
      @type String
     */
    autoResizeText: function () {
      var value = this.get('value');
      return value && value.replace(/ /g, '&nbsp;');
    }.property('value').cacheable(),

    keyDown: function (evt) {
      this.setIfChanged('shouldAutoResize', YES);

      var code = evt.commandCodes()[0],
          key = (evt.which === SC.Event.KEY_RETURN)
                ? 'return'                
                : String.fromCharCode(evt.which),
          useCommasAsDelimiters = this.getPath('parentView.useCommasAsDelimiters');

      // Deal with IME input
      if (useCommasAsDelimiters &&
          evt.isIMEInput && key === 'return' && this.get('value') !== '') {
        var value = this.get('value'),
            uniComma = String.fromCharCode(12289), // Japanese / Mandarin comma
            idx;

        while ((idx = value.indexOf(uniComma)) !== -1) {
          this.get('parentView').createItem(value.slice(0, idx));
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

      if (useCommasAsDelimiters &&
          ReadingList.SearchView.COMMAS.indexOf(evt.which) !== -1) {
        this.get('parentView').createItem(this.get('value'));
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
    },

    /**
      Show hint when the hint is enabled.
     */
    _sv_showHint: function () {
      if (this._hintON) {
        this.setIfChanged('shouldAutoResize', NO);
        this.set('layout', { left: 0, right: 0, top: 0, bottom: 0 });
      } else {
        this.setIfChanged('shouldAutoResize', YES);
      }
    }.observes('shouldShowHint')

  }),

  createItem: function (text) {
    this.get('content').pushObject(SC.Object.create({
      type: '_Any',
      value: text
    }));
  },

  keyDown: function (evt) {
    var code = evt.commandCodes()[0];

    switch (code) {
    // Select previous item
    case 'left':
    case 'ctrl_b':
      break;
    // Select next item or focus the text field
    case 'right':
    case 'ctrl_f':
      break;
    // Select the first item
    case 'ctrl_a':
      break;
    // Select the last item
    case 'ctrl_e':
      break;
    // Backward-delete one item
    case 'backspace':
      break;
    // Forward-delete one item
    case 'delete':
    case 'ctrl_d':
      break;
    // Kill all items after the focused item
    case 'ctrl_k':
      break;
    }
  }
});

ReadingList.SearchView.mixin(
  /** @scope ReadingList.SearchView */{

  COMMAS: [44, 1548], // ',' and Arabic comma
  FORWARDING_KEYS: ['left', 'meta_b', 'ctrl_b', 'ctrl_a', 'meta_a', 'backspace'],
  PANE_KEYS: ['up', 'down', 'return']
});
