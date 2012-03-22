require('views/tag');
require('mixins/selection_support');

SC.SearchView = SC.View.extend(
  /** @scope SC.SearchView.prototype */{

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
    @type Boolean
    @default YES
    @see SC.View#acceptsFirstResponder
   */
  acceptsFirstResponder: YES,

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
  exampleView: SC.TagView.design({
    valueBinding: '*content.value'
  }),

  /**
    The search criterion that the user has provided.
    @extend SC.View
   */
  items: SC.View.design(
    SC.SelectionSupport, {
    classNames: ['items'],
    layout: { height: 26 },
    contentBinding: SC.Binding.oneWay('.parentView*content'),
    exampleView: SC.outlet('parentView.exampleView'),

    contentKey: 'content',
    applySelectionToViews: YES,

    init: function () {
      sc_super();
      this.contentDidChange();
    },

    contentDidChange: function () {
      var content = this.get('content'),
          oldContent = this._content,
          func = this.enumerableContentDidChange;

      if (oldContent) {
        oldContent.removeObserver('[]', this, func);
      }

      if (content) {
        content.addObserver('[]', this, func);
      }

      this._content = content;
      this.enumerableContentDidChange();
    }.observes('content'),

    enumerableContentDidChange: function () {
      var exampleView = this.get('exampleView'),
          content = this.get('content'),
          len = content ? content.get('length') : 0,
          childViews = [],
          i;

      childViews = [];

      for (i = 0; i < len; i++) {
        childViews[i] = exampleView.create({
          parentView: this,
          contentIndex: i,
          content: content.objectAt(i)
        });
      }

      this.replaceAllChildren(childViews);
    }
  }),

  /** @private
    Called when an item is appended to the document.
   */
  didCreateItem: function (view) {
    var field = this.get('field'),
        layout = field.get('layout'),
        width = view.$().outerWidth(),
        tWidth = layout.left + width + this.get('padding');

    field.adjust('left', tWidth);
    view._width = width;
    this.invokeLast(this._sv_adjustScrollOffset);
  },

  /** @private
    Called when an item will be removed from the document.
   */
  willDestroyItem: function (view) {
    var field = this.get('field'),
        layout = field.get('layout'),
        width = view._width,
        tWidth = layout.left - width - this.get('padding');

    field.adjust('left', tWidth);
    this.invokeLast(this._sv_adjustScrollOffset);
  },

  _sv_adjustScrollOffset: function () {
    var width = this.get('frame').width,
        layout = this.getPath('field.layout'),
        padding = this.get('padding');

    if ((layout.left + layout.width) > width) {
      this.get('layer').scrollLeft = layout.left - width + layout.width + padding;
    }
  },

  /** @private */
  _sc_selectionCursorPositionDidChange: function () {
    var items = this.get('items'),
        cursor = items.get('selectionCursorPosition'),
        lastCursor = items.previousSelectableIndexFor(null),
        layer = this.get('layer');

    if (cursor != null && cursor % 1 === 0 && layer) {
      var view = items.childViewForContentIndex(cursor),
          cFrame = view.get('frame'),
          frame = this.get('frame'),
          padding = this.get('padding');

      // Extra padding for last cursor so users can see the text field.
      if (lastCursor === cursor) {
        padding *= 16;
      }

      // Adjust scroll position
      if (cFrame) {
        if (cFrame.x < 0) {
          layer.scrollLeft += cFrame.x - padding;
        } else if ((cFrame.x + cFrame.width + padding) > frame.width) {
          layer.scrollLeft += cFrame.x + cFrame.width - frame.width + padding;
        }
      }
    }
  }.observes('.items*selectionCursorPosition'),

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
          view = this.get('parentView'),
          key = (evt.which === SC.Event.KEY_RETURN)
                ? 'return'                
                : String.fromCharCode(evt.which),
          useCommasAsDelimiters = view.get('useCommasAsDelimiters');

      // Deal with IME input
      if (useCommasAsDelimiters &&
          evt.isIMEInput && key === 'return' && this.get('value') !== '') {
        var value = this.get('value'),
            uniComma = String.fromCharCode(12289), // Japanese / Mandarin comma
            idx;

        while ((idx = value.indexOf(uniComma)) !== -1) {
          view.createItem(value.slice(0, idx));
          value = value.slice(idx + 1);
        }
        this.set('value', value);
        return YES;
      }

      // Forward any event that matches the specified
      // key pattern to the popup suggestion pane
      if (SC.SearchView.PANE_KEYS.indexOf(code) !== -1) {
        var pane = view.get('pane');
        if (pane && pane.get('isPaneAttached')) {
          return pane.keyDown(evt);
        }
      }

      if (useCommasAsDelimiters &&
          SC.SearchView.COMMAS.indexOf(evt.which) !== -1) {
        view.createItem(this.get('value'));
        this.set('value', '');
        evt.preventDefault();
        evt.stopPropagation();
        return YES;

      // Forward any event that matches the specified key pattern
      // when at the beginning of the text field OR the text field's empty
      } else if (SC.SearchView.FORWARDING_KEYS.indexOf(code) !== -1 &&
                 (this.get('value') === '' ||
                 (this.get('cursorPosition') === 0 && this.get('textSelectionLength')))) {
        view.becomeFirstResponder();
        return view.keyDown(evt);
      }

      return sc_super();
    },

    /**
      Show hint when the hint is enabled.
     */
    _sv_showHint: function () {
      if (this._hintON || this.get('shouldShowHint')) {
        this.setIfChanged('shouldAutoResize', NO);
        this.set('layout', { left: 0, right: 0, top: 0, bottom: 0 });
      } else {
        this.setIfChanged('shouldAutoResize', YES);
      }
    }.observes('shouldShowHint')

  }),

  createItem: function (text) {
    this.get('content').pushObject(SC.Object.create({
      value: text
    }));
  },

  keyDown: function (evt) {
    var code = evt.commandCodes()[0],
        items = this.get('items'),
        extend = evt.shiftKey,
        selection = items.get('selection'),
        sLength = selection.get('length'),
        content = this.get('content'),
        responder,
        defaultResponder = this.get('field'),
        handled = YES;

    if (SC.browser.mozilla && (evt.which === 17 || evt.which === 18)) {
      code = 'meta_';
    }

    // Shift mutates the action, but doesn't define it
    code = code && code.replace('shift_', '');
    items.set('useAnchoredSelection', extend);

    switch (code) {
    // Select previous item
    case 'left':
    case 'ctrl_b':
      if (!items.selectPrevious(extend) && !extend) {
        items.selectFirst();
      }
      break;
    // Select next item or focus the text field
    case 'right':
    case 'ctrl_f':
      if (!items.selectNext(extend) && !extend) {
        items.deselectAll();
        responder = this.get('field');
      }
      break;
    // Select the first item
    case 'ctrl_a':
      items.selectFirst(extend);
      break;
    // Select the text field
    case 'up':
    case 'ctrl_e':
      responder = this.get('field');
      items.deselectAll();
      break;
    // Backward-delete one item
    case 'backspace':
      selection && selection.toArray().forEach(function (toRemove) {
        content.removeObject(toRemove);
      });

      if (sLength > 1 || !(items.selectPrevious() || items.selectNext())) {
        responder = defaultResponder;
      }
      break;
    // Forward-delete one item
    case 'delete':
    case 'ctrl_d':
      selection && selection.toArray().forEach(function (toRemove) {
        content.removeObject(toRemove);
      });

      if (sLength > 1 || !(items.selectNext() || items.selectPrevious())) {
        responder = defaultResponder;
      }
      break;
    // Kill all items after the focused item
    case 'ctrl_k':
      responder = defaultResponder;
      var cursor = items.get('selectionCursorPosition');
      if (cursor == null) cursor = -1;

      while (cursor !== -1 && cursor < content.get('length')) {
        content.removeAt(cursor);
      }
      break;
    // Focus the text field if any non meta keys were pressed
    // and forward all other events to the browser
    default:
      if (!evt.ctrlKey && !evt.metaKey) {
        responder = this.get('field');
        items.deselectAll();
      } else {
        handled = NO;
      }
    }

    // reverse tab.
    if (code === 'tab' && evt.shiftKey) return YES;

    if (responder) {
      evt.preventDefault();
      evt.stopPropagation();
      responder.becomeFirstResponder();
    }

    return handled;
  }
});

SC.SearchView.mixin(
  /** @scope SC.SearchView */{

  COMMAS: [44, 1548], // ',' and Arabic comma
  FORWARDING_KEYS: ['left', 'meta_b', 'ctrl_b', 'ctrl_a', 'meta_a', 'backspace'],
  PANE_KEYS: ['up', 'down', 'return']
});
