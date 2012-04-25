require('controllers/feed');

ReadingList.entriesController = SC.ArrayController.create(
  SC.CollectionContent, SC.CollectionRowDelegate, {

  allowsMultipleSelection: NO,
  contentBinding: SC.Binding.oneWay('ReadingList.feedController*entries'),

  contentGroupIndexes: function () {
    return this._groupIndicies;
  },

  contentIndexIsGroup: function (view, content, idx) {
    return this._groupIndicies.contains(idx);
  },

  customRowHeightIndexes: function () {
    return this._groupIndicies;
  }.property().cacheable(),

  contentIndexRowHeight: function () {
    return 20;
  },

  rowHeight: 54,

  arrangedObjects: function () {
    var content = this.get('content'),
        arrangedObjects = [],
        groupIndicies = SC.IndexSet.create(),
        len = content ? content.get('length') : 0,
        i = 0,
        item,
        itemGroup, group,
        now = new Date(),
        date;

    for (; i < len; i++) {
      item = content.objectAt(i);
      date = item.get('published');
      if (SC.isSameDay(now, date)) {
        itemGroup = '_Today';
      } else if (SC.isDayBefore(now, date)) {
        itemGroup = '_Yesterday';
      } else if (SC.isSameWeek(now, date)) {
        itemGroup = '%{date:eeee}'.loc({ date: date,
                                         dateFormatter: SC.DateFormatter });
      } else if (SC.isLastWeek(now, date)) {
        itemGroup = '_Last Week';
      } else {
        itemGroup = '_Older';
      }

      if (group !== itemGroup) {
        group = itemGroup;
        groupIndicies.add(i + groupIndicies.get('length'));
        arrangedObjects.push(group);
      }
      arrangedObjects.push(item);
    }

    this._groupIndicies = groupIndicies;
    this.notifyPropertyChange('customRowHeightIndexes');

    return arrangedObjects;
  }.property('[]').cacheable()
});
