require('controllers/feed');

ReadingList.entriesController = SC.ArrayController.create({
  allowsMultipleSelection: NO,
  contentBinding: SC.Binding.oneWay('ReadingList.feedController*selection.firstObject.entries')
});
