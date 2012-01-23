require('controllers/feed');

ReadingList.entriesController = SC.ArrayController.create({
  contentBinding: SC.Binding.oneWay('ReadingList.feedController*selection.firstObject.entries')
});
