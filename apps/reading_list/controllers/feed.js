require('core');

ReadingList.feedController = SC.ArrayController.create({
  addFeed: function (target) {
    ReadingList.AddFeedPane.create({
      action: function (target) {
        ReadingList.store.find(RSS.Feed, target.get('value'));
      }
    }).popup(target, SC.PICKER_MENU_POINTER);
  }
});