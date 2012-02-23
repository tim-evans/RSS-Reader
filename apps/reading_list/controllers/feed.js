require('core');

ReadingList.feedController = SC.ArrayController.create({

  allowsMultipleSelection: NO,

  addFeed: function (target) {
    ReadingList.AddFeedPane.create({
      action: function (target) {
        var record = ReadingList.store.find(RSS.Feed, target.get('value'));
        if (record.get('isDestroyed')) {
          ReadingList.store.writeStatus(record.get('storeKey'), SC.Record.READY_CLEAN);
          record.refresh();
        }
      }
    }).popup(target, SC.PICKER_MENU_POINTER);
  },

  save: function () {
    if (this.get('length')) {
      SC.userDefaults.set('feeds', this.getEach('feedUrl'));
    }
  }.observes('length')

});