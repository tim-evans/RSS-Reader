// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions @2001 Junction Networks
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SC */

/** @namespace

  Implements common selection management properties for controllers and views.

  Selection can be managed by any controller in your applications. This mixin
  provides some common management features you might want such as disabling
  selection, or restricting empty or multiple selections.

  This mixin will look for the content at the given `contentKey` to
  manage the selection. By default, `contentKey` is set to `"arrangedObjects"`
  to make `SC.ArrayController` work out-of-the-box with it well.

  `SC.SelectionSupport` provides simple selection functions that abstract away
  `SC.SelectionSet`s to allow programatically selecting items in an enumerable
  straightforward.
  
  It also has an option to proxy the `isSelected` property to mapped child
  views.

  @since SproutCore 1.0
 */
SC.SelectionSupport = {

  /**
    The content key that the selection is being applied to.

    @type String
    @default 'arrangedObjects'
   */
  contentKey: 'arrangedObjects',

  /**
    If `YES`, selection is allowed.

    @type Boolean
    @default YES
  */
  allowsSelection: YES,

  /** @private */
  allowsSelectionBindingDefault: SC.Binding.bool(),

  /**
    If `YES`, allow multiple selection.

    @default YES
    @type Boolean
   */
  allowsMultipleSelection: YES,

  /** @private */
  allowsMultipleSelectionBindingDefault: SC.Binding.bool(),

  /**
    If `YES`, allow empty selection.

    @default YES
    @type Boolean
   */
  allowsEmptySelection: YES,

  /** @private */
  allowsEmptySelectionBindingDefault: SC.Binding.bool(),

  /**
    Use toggle selection instead of normal click behavior.

    If set to true, then selection will use a toggle instead of the normal
    click behavior.  Command modifiers will be ignored and instead clicking
    once will select an item and clicking on it again will deselect it.

    @type Boolean
    @default NO
  */
  useToggleSelection: NO,

  /**
    Whether circular selection is allowed.

    If this is enabled, when using `selectNext` and
    `selectPrevious`, reaching the end of the content
    will circle back to the beginning of the list.

    @type Boolean
    @default NO
   */
  allowsCircularSelection: NO,

  /**
    An index set of content indicies that
    are unselectable.

    @type SC.IndexSet
    @default SC.IndexSet.EMPTY
   */
  unselectableIndicies: SC.IndexSet.EMPTY,

  /**
    The content index where the selection cursor is.

    If the cursor is halfway between two numbers (ie. 4.5),
    this indicates that the index was deleted, and
    the selection should be adjusted accordingly.

    @type Number
    @default 0
   */
  selectionCursorPosition: 0,

  /**
    Whether `select` should use an anchor to select
    multiple items.

    @type Boolean
    @default NO
   */
  useAnchoredSelection: NO,

  /**
    The content index of the anchor where the selection
    should be extended by.
    @type Number
    @default 0
   */
  selectionAnchor: 0,

  /**
    Returns the first object that is not in `unselectableIndicies`.

    @field
    @type Object
   */
  firstSelectableObject: function () {
    return this.get(this.get('contentKey')).objectAt(this.nextSelectableIndexFor(null));
  }.property(),

  /**
    This is the current selection. You can make this selection
    and another controller's selection work in concert by binding
    them together. You generally have a master selection that
    relays changes TO all the others.

    @field
    @type SC.SelectionSet
    @default SC.SelectionSet.EMPTY
   */
  selection: function (key, value) {
    var old = this._scsel_selection,
        oldlen = old ? old.get('length') : 0,
        empty,
        content = this.get(this.get('contentKey')),
        len;

    // If multiple selection isn't allowed or we're not
    // setting the value, just return the old selection
    if (value === undefined || !this.get('allowsSelection')) {
      value = old;
    }

    len = value && value.isEnumerable ? value.get('length') : 0;

    // If we don't allow multiple selection,
    // force the selection to be the first item in the new selection set.
    if (len > 1 && !this.get('allowsMultipleSelection')) {
      if (oldlen > 1) {
        value = SC.SelectionSet.create().addObject(old.get('firstObject')).freeze();
        len = 1;
      } else {
        value = old;
        len = oldlen;
      }
    }

    // If we don't allow empty selection, fill
    // the selection set with the first selectable item.
    if (len === 0 && !this.get('allowsEmptySelection') &&
        content && content.get('length') !== 0) {
      if (oldlen === 0) {
        value = this.get('firstSelectableObject');
        if (value) {
          value = SC.SelectionSet.create().addObject(value).freeze();
        } else {
          value = SC.SelectionSet.EMPTY;
        }
        len = value.get('length');
      } else {
        value = old;
        len = oldlen;
      }
    }

    if (len === 0) {
      value = SC.SelectionSet.EMPTY;
    }

    if (value !== old) {
      value = value.frozenCopy();
    }

    this._scsel_selection = value;

    return value;
  }.property('allowsEmptySelection', 'allowsMultipleSelection', 'allowsSelection').cacheable(),

  /**
    Whether the reciever currently has a non-zero selection.

    @field
    @type Boolean
   */
  hasSelection: function () {
    return !!this.getPath('selection.length');
  }.property('selection').cacheable(),

  // ..........................................................
  // DEFAULT FUNCTIONS (OVERRIDE IF NEEDED)
  //

  /**
    Will apply selection state to child views.

    This assumes that the current object that this is mixed
    into has a `childViews` array.
    @type Boolean
    @default NO
   */
  applySelectionToViews: NO,

  /**
    Returns the childView for the given content index.

    By default, this method returns the childView at the
    same index in the `childViews` array.

    @param {Number} contentIndex The content index to get the view of.
    @returns {SC.View} The view at the given content index.
   */
  childViewForContentIndex: function (idx) {
    return this.get('childViews').objectAt(idx);
  },

  /**
    Returns the content index for the given childView.

    By default, this method returns the index of the childView
    in the `childViews` array.

    @param {SC.View} view The view to get the content index of.
    @returns {Number} The content index of the given view.
   */
  contentIndexForChildView: function (view) {
    return this.get('childViews').indexOf(view);
  },

  // ..........................................................
  // SELECTION PRIMITIVES
  //

  /**
    Selects a view, extending the selection optionally.
    @param {SC.View} view The view to select.
    @param {Boolean} [extend] If the current selection should be extended.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  selectView: function (view, extend) {
    return this.select(this.contentIndexForChildView(view),
                       extend);
  },

  /**
    Selects a view, extending the selection optionally.
    @param {Object} object The object to select.
    @param {Boolean} [extend] If the current selection should be extended.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  selectObject: function (object, extend) {
    var content = this.get(this.get('contentKey'));
    return this.select(content.indexOf(object),
                       extend);
  },

  /**
    Selects the passed objects in your content. If you set `extend` toYES,
    then this will attempt to extend your selection as well.

    @param {SC.Enumerable} objects The objects to select.
    @param {Boolean} [exetend] If the current selection should be extended.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  selectObjects: function (objects, extend) {
    var set = SC.SelectionSet.EMPTY;

    if (objects && objects.get('length') === 0) {
      set = SC.SelectionSet.create().addObjects(objects).freeze();
    }
    return this.select(set, extend);
  },

  /**
    Select an object, extending the selection optionally.

    @param {Number|SC.IndexSet|SC.SelectionSet} thing The item(s) to select.
    @param {Boolean} [extend] If the current selection should be extended.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  select: function (idx, extend) {
    var content = this.get(this.get('contentKey')),
        unselectableIndicies = this.get('unselectableIndicies'),
        anchor, cursor, start, len,
        isOutOfRange;

    // Check if the index is unselectable or out of range
    if (SC.typeOf(idx) === SC.T_NUMBER) {
      isOutOfRange = idx < 0 || idx >= content.get('length');
      if (unselectableIndicies) {
        isOutOfRange = isOutOfRange || unselectableIndicies.contains(idx);
      }
    }

    // Transform the selection set into it's relative index set
    if (idx && idx.isSelectionSet) {
      idx = idx.indexSetForSource(content);
    }

    // Remove all unselectable indicies from the proposed selection
    if (idx && idx.isIndexSet && unselectableIndicies) {
      idx = idx.without(unselectableIndicies);
    }

    if (!this.get('allowsSelection') || idx == null || isOutOfRange) return NO;


    var set = (extend && this.get('allowsMultipleSelection')) ?
      this.get('selection').copy() : SC.SelectionSet.create();

    if (SC.typeOf(idx) === SC.T_NUMBER) {
      // Toggled selection
      if (this.get('useToggleSelection') && set.contains(content, idx, 1)) {
        set.remove(content, idx, 1);
        this.setIfChanged('selectionAnchor', null);

      // Anchored selection
      } else if (extend && this.get('useAnchoredSelection')) {
        // Fix the anchor
        anchor = this.get('selectionAnchor');
        cursor = Math.floor(this.get('selectionCursorPosition'));
        if (anchor != null && SC.typeOf(anchor) !== SC.T_NUMBER) {
          anchor = content.indexOf(anchor);
        }

        // We want a clean selection for this.
        set = SC.SelectionSet.create();

        anchor = anchor == null ? cursor : anchor;
        this.setIfChanged('selectionAnchor', anchor);
        set.add(content, (anchor > idx) ? idx : anchor,
                         Math.abs(anchor - idx) + 1);

      // Normal selection
      } else {
        set.add(content, idx, 1);
        this.setIfChanged('selectionAnchor', null);
      }

      this.setIfChanged('selectionCursorPosition', idx);
    } else if (SC.instanceOf(idx, SC.SelectionSet)) {
      set = idx;
    } else if (this.get('useToggleSelection') && set.contains(content, idx)) {
      this.deselect(idx);
    } else {
      set.add(content, idx);
    }

    this.set('selection', set.freeze());
    return this;
  },

  /**
    Selects all selectable items.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  selectAll: function () {
    var content = this.get(this.get('contentKey'));
        len = content ? content.get('length') : 0;
    return this.select(SC.IndexSet.create(0, len));
  },

  /**
    Deselects a view, extending the selection optionally.
    @param {SC.View} view The view to select.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  deselectView: function (view) {
    return this.deselect(this.contentIndexForChildView(view));
  },

  /**
    Deselects a view, extending the selection optionally.
    @param {Object} object The object to select.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  deselectObject: function (object) {
    var content = this.get(this.get('contentKey'));
    return this.deselect(content.indexOf(object));
  },

  /**
    Deselects the passed objects in your content.

    @param {SC.Enumerable} objects The objects to deselect.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  deselectObjects: function (objects, extend) {
    var set = SC.SelectionSet.EMPTY;

    if (objects && objects.get('length') === 0) {
      set = SC.SelectionSet.create().addObjects(objects).freeze();
    }
    return this.deselect(set);
  },

  /**
    Deselect an index.

    @param {Number|SC.IndexSet|SC.SelectionSet} thing The item(s) to deselect.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  deselect: function (idx) {
    var set = this.get('selection').copy(),
        content = this.get(this.get('contentKey'));

    // Mutate the selection set into an IndexSet
    if (idx != null && idx.isSelectionSet) {
      idx = idx.indexSetForSource(content);
    }

    if (idx != null && set.contains(content, idx)) {
      set.remove(content, idx);
      this.set('selection', set.freeze());
      return this;
    }

    return NO;
  },

  /**
    Deselects all selected items.
    @returns {Boolean|SC.Object} The reciever or NO.
   */
  deselectAll: function () {
    return this.deselect(this.get('selection'));
  },

  /**
    Returns the next selectable index for the given
    index. If no index is provided, the first selectable
    index will be returned.

    If no more indicies are selectable, then -1 will
    be returned.

    @param {Number} [idx] The index to search from.
    @returns {Number} The next selectable index.
   */
  nextSelectableIndexFor: function (idx) {
    var content = this.get(this.get('contentKey')),
        len = content && content.get('length');

    if (content == null) idx = -1;
    if (idx == null) idx = -1;

    if (idx + 1 >= len &&
        this.get('allowsCircularSelection')) {
      idx = this.nextSelectableIndexFor(null);
    } else {
      // Deal with half positions
      idx = ((idx % 1) !== 0) ? Math.ceil(idx) : idx + 1;
    }

    if (this.get('unselectableIndicies').contains(idx)) {
      return this.nextSelectableIndexFor(idx);
    }

    if (len == null || idx < 0 || idx >= len) idx = -1;
    return idx;
  },

  /**
    Returns the previous selectable index for the given
    index. If no index is provided, the last selectable
    index will be returned.

    If no more indicies are selectable, then -1 will
    be returned.

    @param {Number} [idx] The index to search from.
    @returns {Number} The previous selectable index.
   */
  previousSelectableIndexFor: function (idx) {
    var content = this.get(this.get('contentKey')),
        len = content && content.get('length');

    if (content == null) idx = -1;
    if (idx == null) idx = content.get('length');

    if (idx - 1 < 0 &&
        this.get('allowsCircularSelection')) {
      idx = this.previousSelectableIndexFor(null);
    } else {
      // Deal with half positions
      idx = ((idx % 1) !== 0) ? Math.floor(idx) : idx - 1;
    }

    if (this.get('unselectableIndicies').contains(idx)) {
      return this.previousSelectableIndexFor(idx);
    }

    if (len == null || idx < 0 || idx >= len) idx = -1;
    return idx;
  },

  /**
    Select the first available content index.

    @param {Boolean} extend Whether or not the selection should be extended.
    @returns {Boolean} If the selection was successful.
   */
  selectFirst: function (extend) {
    return this.select(this.nextSelectableIndexFor(null), extend);
  },

  /**
    Select the last available content index.

    @param {Boolean} extend Whether or not the selection should be extended.
    @returns {Boolean} If the selection was successful.
   */
  selectLast: function (extend) {
    return this.select(this.previousSelectableIndexFor(null), extend);
  },

  /**
    Select the first available content index that's preceding the
    current selection.

    @param {Boolean} extend Whether or not the selection should be extended.
    @returns {Boolean} If the selection was successful.
   */
  selectPrevious: function (extend) {
    return this.select(this.previousSelectableIndexFor(this.get('selectionCursorPosition')), extend);
  },

  /**
    Select the first available content index that's after the
    current selection.

    @param {Boolean} extend Whether or not the selection should be extended.
    @returns {Boolean} If the selection was successful.
   */
  selectNext: function (extend) {
    return this.select(this.nextSelectableIndexFor(this.get('selectionCursorPosition')), extend);
  },

  // ..........................................................
  // INTERNAL METHODS / OBSERVING
  //

  /** @private */
  initMixin: function () {
    // set up content observing
    this._scsel_contentKeyDidChange();
    this._scsel_selectionDidChange();

    // if `selection` is bound, we have to wait.
    this.invokeLater(this._scsel_unselectableIndiciesDidChange);

    this.addObserver('hasSelection', this, this._scsel_hasSelectionDidChange);
    this.addObserver('selection', this, this._scsel_selectionDidChange);
    this.addObserver('unselectableIndicies', this, this._scsel_unselectableIndiciesDidChange);
    this.addObserver('contentKey', this, this._scsel_contentKeyDidChange);
  },

  /** @private */
  destroyMixin: function () {
    this.removeObserver('hasSelection', this, this._scsel_hasSelectionDidChange);
    this.removeObserver('selection', this, this._scsel_selectionDidChange);
    this.removeObserver('unselectableIndicies', this, this._scsel_unselectableIndiciesDidChange);
    this.removeObserver('contentKey', this, this._scsel_contentKeyDidChange);
  },

  /** @private */
  _scsel_hasSelectionDidChange: function () {
    if (!this.get('hasSelection')) this.setIfChanged('selectionCursorPosition', null);
  },

  /** @private
    Notified when `selection` changes.
   */
  _scsel_selectionDidChange: function () {
    var sel  = this.get('selection'),
        last = this._scss_selection,
        func = this._scsel_selectionDidMutate;

    if (sel === last) return; // nothing to do
    if (last) last.removeObserver('[]', this, func);
    if (sel) sel.addObserver('[]', this, func);

    this._scss_selection = sel;
    this._scsel_selectionDidMutate();
  },

  /** @private
    Notified when `selection` mutates.
   */
  _scsel_selectionDidMutate: function () {
    var sel  = this.get('selection'),
        last = this._scsel_indicies, // clone of last known indicies
        content = this.get(this.get('contentKey')),
        diff;

    // save new last
    this._scsel_indicies = sel ? sel.frozenCopy() : null;

    // determine which indicies are now invalid
    if (last) last = last.indexSetForSource(content);
    if (sel) sel = sel.indexSetForSource(content);

    if (sel && last) diff = sel.without(last).add(last.without(sel));
    else diff = sel || last;

    if (diff && diff.get('length') > 0) this.invalidateSelectionIndicies(diff);
  },

  /** @private
    Notified when `unselectableIndicies` changes.
   */
  _scsel_unselectableIndiciesDidChange: function () {
    var idx  = this.get('unselectableIndicies'),
        last = this._scsel_unselectableIndicies,
        func = this._scsel_unselectableIndiciesDidMutate;

    if (idx === last) return; // nothing to do
    if (last) last.removeObserver('[]', this, func);
    if (idx) idx.addObserver('[]', this, func);

    this._scsel_unselectableIndicies = idx;
    this._scsel_unselectableIndiciesDidMutate();
  },

  /** @private
    Notified when `unselectableIndicies` mutates.
   */
  _scsel_unselectableIndiciesDidMutate: function () {
    // Invalidate everything.
    this.invalidateSelectionIndicies(
      SC.IndexSet.create(0, this.getPath(this.get('contentKey') + '.length')));
  },

  /** @private */
  _scsel_contentKeyDidChange: function () {
    var key = this.get('contentKey'),
        didChange = this._scsel_contentDidChange;

    // Cleanup observers
    if (this._scsel_lastContentKey) {
      this.removeObserver(this._scsel_lastContentKey, didChange);
    }
    this._scsel_lastContentKey = key;

    this.addObserver(key, this, didChange);

    this._scsel_contentDidChange();
  },

  /** @private */
  _scsel_contentDidChange: function () {
    var content = this.get(this.get('contentKey')),
        lastContent = this._scsel_lastContent;
        willChange = this._scsel_arrayContentWillChange,
        didChange = this._scsel_arrayContentDidChange;

    if (lastContent && lastContent.isSCArray) {
      lastContent.removeArrayObservers({
        target: this,
        didChange: didChange,
        willChange: willChange
      });
    }

    this._scsel_lastContent = content;

    if (content && content.isSCArray) {
      content.addArrayObservers({
        target: this,
        didChange: didChange,
        willChange: willChange
      });
      this.invalidateSelectionIndicies(SC.IndexSet.create(0, content.get('length')));
    }

    this.notifyPropertyChange('selection');
  },

  /** @private */
  _scsel_arrayContentWillChange: function (start, removed, added) {
    // Update to account for deletions
    var source = this.get(this.get('contentKey')),
        is = this.get('selection').indexSetForSource(source);

    is = is && is.reduce(function (set, idx) {
      if (idx < start) {
        set.add(idx, 1);
      } else if (idx >= start + removed) {
        set.add(idx - removed, 1);
      }
      return set;
    }, SC.IndexSet.create());

    this._scsel_newSelection = is;
  },

  /** @private */
  _scsel_arrayContentDidChange: function (start, removed, added) {
    // Update to account for insertions
    var source = this.get(this.get('contentKey')),
        is = this._scsel_newSelection,
        cursor = this.get('selectionCursorPosition');

    is = is && is.reduce(function (set, idx) {
      if (idx < start) {
        set.add(idx, 1);
      } else if (idx >= start + added) {
        set.add(idx + added, 1);
      }
      return set;
    }, SC.IndexSet.create());

    if (is) {
      this.set('selection', SC.SelectionSet.create().add(source, is).freeze());
      this.invalidateSelectionIndicies(SC.IndexSet.create(start, start + (removed || added)));
    }

    // The cursor was deleted, fix that.
    if (cursor >= start && cursor < (start + removed)) {
      cursor -= removed / 2; // Half position
    } else if (cursor != null && cursor >= start) {
      cursor += added;
      if (cursor >= start + removed) {
        cursor -= removed;
      }
    }

    this.setIfChanged('selectionCursorPosition', cursor);
  },

  /**
    Invalidate the given content indicies `isSelected` property.

    @param {SC.IndexSet} invalids A set of invalid indicies.
    @returns {void}
   */
  invalidateSelectionIndicies: function (invalids) {
    if (!this.get('applySelectionToViews')) return;

    var content = this.get(this.get('contentKey')),
        selection = this.get('selection'),
        view;

    invalids.forEach(function (idx) {
      view = this.childViewForContentIndex(idx);
      if (view) {
        view.setIfChanged('isSelected', selection ? selection.contains(content, idx) : NO);
      }
    }, this);
  },

  /**
    This method used to update the selection, now it's a no-op.
    @deprecated
   */
  updateSelectionAfterContentChange: SC.K

};
