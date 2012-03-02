ReadingList.InboxState = SC.State.extend({

  initialSubstate: 'feedList',

  enterState: function () {
    var view = ReadingList.mainPage.get('lists');
    if (!view.get('isVisible')) {
      view.set('isVisible', YES);
      setTimeout(function () {
        SC.run(function () {
          view.animate('opacity', 1, {
            timing: 'ease-out',
            duration: .25
          });
        });
      }, 0);
    }
  },

  exitState: function () {
    var view = ReadingList.mainPage.get('lists');

    view.animate('opacity', 0, {
      timing: 'ease-out',
      duration: .25
    }, function () {
      view.set('isVisible', NO);
    });
  },

  feedList: SC.State.design({
    enterState: function () {
    var view = ReadingList.mainPage.get('feeds');

      if (!view.get('isVisible')) {
        view.set('isVisible', YES);
        setTimeout(function () {
          SC.run(function () {
            view.animate({
              left: 0,
              right: 0
            }, {
              timing: 'ease-out',
              duration: .25
            });
          });
        }, 0);
      }
    },

    exitState: function () {
      var view = ReadingList.mainPage.get('feeds');

      setTimeout(function () {
        SC.run(function () {
          view.animate({
            left: -1 * SC.getPath(view, 'frame.width'),
            right: SC.getPath(view, 'frame.width')
          }, {
            timing: 'ease-out',
            duration: .25
          }, function () {
            view.set('isVisible', NO);
          });
        });
      }, 0);
    },

    viewEntries: function () {
      this.gotoState('entryList');
    },

    manageFeeds: function () {
      this.gotoState('manager');
    }
  }),

  entryList: SC.State.design({
    enterState: function () {
      var view = ReadingList.mainPage.get('entries');

      view.adjust({
        left: SC.getPath(view, 'frame.width'),
        right: -1 * SC.getPath(view, 'frame.width')
      });

      view.set('isVisible', YES);
      setTimeout(function () {
        SC.run(function () {
          view.animate({
            left: 0,
            right: 0
          }, {
            timing: 'ease-out',
            duration: .25
           });
        });
      }, 0);
    },

    viewFeeds: function () {
      this.gotoState('feedList');
    },

    exitState: function () {
      var view = ReadingList.mainPage.get('entries');

      setTimeout(function () {
        SC.run(function () {
          view.animate({
            left: SC.getPath(view, 'frame.width'),
            right: -1 * SC.getPath(view, 'frame.width')
          }, {
            timing: 'ease-out',
            duration: .25
          }, function () {
            view.set('isVisible', NO);
          });
        });
      }, 0);
    }
  })
});
