require('controllers/feeds');

ReadingList.feedController = SC.ObjectController.create({
  contentBinding: SC.Binding.oneWay('ReadingList.feedsController*selection.firstObject')
});
