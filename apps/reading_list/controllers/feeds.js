require('core');

ReadingList.feedsController = SC.ArrayController.create({

  allowsMultipleSelection: NO,

  save: function () {
    if (this.get('length')) {
      SC.userDefaults.set('feeds', this.getEach('feedUrl'));
    }
  }.observes('length')

});
