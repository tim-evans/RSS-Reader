SC.mixin(SC.ScrollerView.prototype, {
  scrollbarThickness: 12,
  buttonLength: 6,
  capLength: 14,
  hasButtons: NO
});

SC.mixin(SC.ScrollView.prototype, {
  verticalOverlay: YES
});
