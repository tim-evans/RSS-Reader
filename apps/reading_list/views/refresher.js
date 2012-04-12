ReadingList.RefresherView = SC.LabelView.extend(
  SC.ActionSupport, {

  classNames: ['refresher'],

  escapeHTML: NO,

  value: function () {
    var lastUpdated = this.get('lastUpdated');
    return lastUpdated ?
           '_Last updated on %@'.loc({ date: this.get('lastUpdated'),
                                       dateFormatter: SC.DateFormatter }) : '';
  }.property('lastUpdated').cacheable(),

  mouseDown: function () {
    this.set('isActive', YES);
  },

  mouseUp: function () {
    this.set('isActive', NO);
    this.fireAction();
  }
});
