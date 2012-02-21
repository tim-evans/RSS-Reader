SC.ScrollerView.reopen({
  render: function (original, context, firstTime) {
    context.setClass('active', this._thumbDragging);
    return original(context, firstTime);
  }.enhance(),

  mouseUp: function (original, evt) {
    var wasDraggingThumb = this._thumbDragging,
        ret = original(evt);
    if (wasDraggingThumb && !this._thumbDragging) {
      this.displayDidChange();
    }
  }.enhance()
});

SC.mixin(SC.ScrollerView.prototype, {
  scrollbarThickness: 12,
  buttonLength: 6,
  capLength: 14,
  hasButtons: NO
});

SC.mixin(SC.ScrollView.prototype, {
  verticalOverlay: YES
});
