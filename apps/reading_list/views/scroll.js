SC.mixin(SC.ScrollerView.prototype, {
  scrollbarThickness: 12,
  capLength: 0,
  capOverlap: 0,
  buttonLength: 0,
  hasButtons: NO
});

SC.mixin(SC.ScrollView.prototype, {
  verticalOverlay: YES
});
