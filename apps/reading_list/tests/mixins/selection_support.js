// ==========================================================================
// Project:   SC.SelectionSupport Unit Test
// Copyright: ©2011 Junction Networks
// ==========================================================================
/*globals JN module test ok equals same stop start */

var pane, view, content, childViews;
module("SelectionSupport", {
  setup: function () {
    SC.RunLoop.begin();

    content = 'a b c d e f g h i j'.w();
    childViews = content.map(function (value) {
      return SC.LabelView.create({
        value: value
      });
    });

    view = SC.View.create(SC.SelectionSupport, {
      contentKey: 'kontent',
      applySelectionToViews: YES,
      kontent: content,
      content: content,
      childViews: childViews
    });

    pane = SC.MainPane.create();
    pane.appendChild(view);
    pane.append();
    
    SC.RunLoop.end();
  },

  teardown: function() {
    SC.RunLoop.begin();
    pane.remove();
    SC.RunLoop.end();
  }

});

test("the selection is initially empty", function () {
  equals(view.getPath('selection.length'), 0,
         'no items should be initially selected');
});

test("childViewForContentIndex should return the childView for the given content", function () {
  childViews.forEach(function (v, idx) {
    equals(view.childViewForContentIndex(idx), v);
  });
  ok(!view.childViewForContentIndex(content.length),
     'no childView should be found for out of index ranges');
});

test("contentIndexForChildView should return the content index for the given childView", function () {
  childViews.forEach(function (v, idx) {
    equals(view.contentIndexForChildView(v), idx);
  });
  equals(view.contentIndexForChildView(null), -1,
     'no content index should be found for out of index ranges');
});

test("select should be able to take indicies to select content", function () {
  equals(view, view.select(0));
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[0]);
});

test("selectObject will use 'contentKey' to retrieve the content", function () {
  equals(view, view.selectObject('j'));
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), 'j');
});

test("selectView will use SC.View to select the content", function () {
  equals(view, view.selectView(childViews[3]));
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[3]);
});

test("select can take SC.IndexSet set to select items", function () {
  equals(view, view.select(SC.IndexSet.create(0, 3)));
  equals(view.getPath('selection.length'), 3);
  view.get('selection').toArray().forEach(function (value, idx) {
    equals(value, content[idx]);
  });
});

test("select can take SC.SelectionSet set to select items", function () {
  var set = SC.SelectionSet.create();
  set.add(content, 3, 1);
  set.add(content, 5, 1);
  equals(view, view.select(set));
  equals(view.getPath('selection.length'), 2);
  var sel = view.get('selection').toArray();
  equals(sel[0], content[3]);
  equals(sel[1], content[5]);
});

test("select should return NO if it's not selectable", function () {
  equals(NO, view.select(null));
  equals(NO, view.select(void(0)));
  equals(NO, view.select(100));
  equals(NO, view.selectView(view));
});

test("selecting an item and extending the select will keep along previously selected items", function () {
  equals(view.getPath('selection.length'), 0);
  view.select(1, YES);
  equals(view.getPath('selection.length'), 1);
  view.select(5, YES);
  equals(view.getPath('selection.length'), 2);
  var sel = view.get('selection').toArray();
  equals(sel[0], content[1]);
  equals(sel[1], content[5]);
});

test("selecting an item will apply the `isSelected` to the appropriate childView", function () {
  childViews.forEach(function (v) {
    ok(!v.get('isSelected'), 'no view should be selected');
  });

  SC.RunLoop.begin();
  view.select(0);
  SC.RunLoop.end();

  ok(childViews[0].get('isSelected'), 'the first childView should be selected');
});

test("`isSelected` triggers off of changes to `selection`", function () {
  var set = SC.SelectionSet.create();
  set.add(content, 3, 1);
  set.add(content, 5, 1);

  SC.RunLoop.begin();
  view.set('selection', set);
  SC.RunLoop.end();

  ok(childViews[3].get('isSelected'));
  ok(childViews[5].get('isSelected'));
});

test("if `allowsSelection` is set to NO, no item can be selected", function () {
  view.set('allowsSelection', NO);

  equals(view.getPath('selection.length'), 0);
  view.select(1);
  equals(view.getPath('selection.length'), 0);
});

test("if `useToggleSelection` is set to YES, selecting a selected item will deselect it", function () {
  view.set('useToggleSelection', YES);

  equals(view.getPath('selection.length'), 0);
  view.select(1, YES);
  equals(view.getPath('selection.length'), 1);
  view.select(1, YES);
  equals(view.getPath('selection.length'), 0);
});

test("deselect shouldn't barf on `null` or `undefined`", function () {
  equals(NO, view.deselect(null));
  equals(NO, view.deselect(void(0)));
});

test("deselect should deselect the given index", function () {
  equals(view, view.select(0));
  equals(view, view.select(1, YES));
  equals(view.getPath('selection.length'), 2);
  equals(view, view.deselect(0));
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[1]);
});

test("deselectView should deselect the given view", function () {
  equals(view, view.select(0));
  equals(view, view.select(1, YES));
  equals(view.getPath('selection.length'), 2);
  equals(view, view.deselectView(childViews[0]));
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[1]);
});

test("deselect should deselect the given IndexSet", function () {
  equals(view, view.select(0));
  equals(view, view.select(1, YES));
  equals(view.getPath('selection.length'), 2);
  equals(view, view.deselect(SC.IndexSet.create(0, 2)));
  equals(view.getPath('selection.length'), 0);
});

test("deselect should deselect the given SelectionSet", function () {
  equals(view, view.select(0));
  equals(view, view.select(1, YES));
  equals(view.getPath('selection.length'), 2);
  var set = SC.SelectionSet.create();
  set.add(content, 0, 1);
  set.add(content, 1, 1);
  equals(view, view.deselect(set));
  equals(view.getPath('selection.length'), 0);
});

test("selection should mutate when the content array changes", function () {
  view.selectObject('c');
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), 'c');

  // deletions
  content.removeObject('b');
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), 'c');

  // additions
  content.unshiftObject('z');
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), 'c');
});

test("when the selected index is removed, the selection should be removed", function () {
  view.selectObject('c');
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), 'c');
  content.removeObject('c');
  equals(view.getPath('selection.length'), 0);
});

test("when 'contentKey' changes, the selection should persist", function () {
  view.select(0);
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[0]);

  // Same content
  SC.RunLoop.begin();
  view.set('contentKey', 'content');
  SC.RunLoop.end();
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[0]);

  // nil content
  SC.RunLoop.begin();
  view.set('contentKey', 'content?');
  SC.RunLoop.end();

  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[0]);
});

test("'unselectableIndicies' should be unselectable", function () {
  view.set('unselectableIndicies', SC.IndexSet.create(3, 3));
  equals(view, view.select(0), '1');
  equals(view, view.select(1), '2');
  equals(view, view.select(2), '3');
  equals(NO, view.select(3), '4');
  equals(NO, view.select(4), '5');
  equals(NO, view.select(5), '6');
  equals(view, view.select(6));
  equals(view, view.select(7));
});

test("'selectionCursorPosition' should keep track of the item that was last selected", function () {
  // defaults
  equals(0, view.get('selectionCursorPosition'));

  view.select(2);
  equals(2, view.get('selectionCursorPosition'));

  view.selectObject('f');
  equals(content.indexOf('f'), view.get('selectionCursorPosition'));

  // removals
  content.removeObject('d');
  equals(content.indexOf('f'), view.get('selectionCursorPosition'));

  // additions
  content.unshiftObject('z');
  content.unshiftObject('x');
  equals(content.indexOf('f'), view.get('selectionCursorPosition'));

  var lastPosition = view.get('selectionCursorPosition');

  // half positions happen when the cursor index itself was deleted.
  content.removeObject('f');
  equals(lastPosition - .5, view.get('selectionCursorPosition'));
});

test("invalidateSelectionIndicies will update `isSelected` properties on childViews", function () {
  var set = SC.SelectionSet.create();
  set.add(content, 2, 1);
  set.add(content, 4, 1);

  // No observing here.
  view.selection = set;
  ok(!childViews[2].get('isSelected'), 'should be unselected');
  ok(!childViews[4].get('isSelected'), 'should be unselected');

  view.invalidateSelectionIndicies(SC.IndexSet.create(0, content.length));

  ok(childViews[2].get('isSelected'));
  ok(childViews[4].get('isSelected'));
});

// Selection with anchoring
test("'select' will allow anchored selection when extend is set to YES and useAnchoredSelection is set to YES", function () {
  view.set('useAnchoredSelection', YES);
  view.select(4, YES);

  equals(view.getPath('selection.length'), 5);
  view.get('selection').toArray().forEach(function (value, idx) {
    equals(value, content[idx]);
  });

  // change the anchor location.
  view.select(9);
  view.select(5, YES);

  equals(view.getPath('selection.length'), 5);
  view.get('selection').toArray().reverse().forEach(function (value, idx) {
    equals(value, content[9 - idx]);
  });
});

test("'selectFirst' will select the first index", function () {
  equals(view, view.selectFirst());

  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[0]);
});

test("'selectLast' will select the last index", function () {
  equals(view, view.selectLast());

  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[content.length - 1]);
});

test("'selectNext' will select the next index", function () {
  equals(view, view.selectNext());

  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[1]);

  equals(view, view.selectNext());

  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[2]);

  // can't select anything after `childViews.length`
  equals(view, view.select(content.length - 1));
  equals(NO, view.selectNext());
});

test("'selectPrevious' will select the previous index", function () {
  // can't select anything before `0`
  equals(NO, view.selectPrevious());

  equals(view, view.select(5));

  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[5]);

  equals(view, view.selectPrevious());

  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[4]);

  equals(view, view.selectPrevious());

  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[3]);
});

test("'selectAll' will select all selectable items", function () {
  equals(view, view.selectAll());
  equals(view.getPath('selection.length'), content.get('length'));
});

test("'deselectAll' will deselect all selected items", function () {
  equals(view, view.selectAll());
  equals(view.getPath('selection.length'), content.get('length'));

  equals(view, view.deselectAll());
  equals(view.getPath('selection.length'), 0);

  equals(NO, view.deselectAll());

  equals(view, view.selectFirst());
  equals(view.getPath('selection.length'), 1);

  equals(view, view.deselectAll());
  equals(view.getPath('selection.length'), 0);
});

test("'allowsCircularSelection'; creating a circular list", function () {
  view.set('allowsCircularSelection', YES);

  view.set('selectionCursorPosition', content.get('length') - 1);
  equals(view, view.selectNext());
  equals(view.get('selection').toArray()[0], content[0]);

  view.set('selectionCursorPosition', 0);
  equals(view, view.selectPrevious());
  equals(view.get('selection').toArray()[0], content.slice(-1)[0]);
});

test("when 'hasSelection' is false, cursors are reset", function () {
  equals(view, view.select(0));
  equals(view.getPath('selection.length'), 1);
  equals(view.get('selection').toArray().objectAt(0), content[0]);
  equals(view.get('selectionCursorPosition'), 0);

  equals(view, view.deselect(0));
  equals(view.getPath('selection.length'), 0);
  equals(view.get('selectionCursorPosition'), null);
  equals(view.get('selectionAnchorPosition'), null);
});
