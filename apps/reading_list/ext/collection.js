SC.CollectionView.reopen(
  /** @scope SC.CollectionView.prototype */{

  /**
    Patch `_cv_performSelectAction` to only perform the action
    when there is a view that has been targeted by the click and
    there is actually a selection.
   */
  _cv_performSelectAction: function (original, view) {
    if (view != null && this.getPath('selection.length') > 0) {
      original.apply(null, SC.A(arguments).slice(1));
    }
  }.enhance()

});
