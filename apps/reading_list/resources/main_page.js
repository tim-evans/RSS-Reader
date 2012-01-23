// ==========================================================================
// Project:   ReadingList - mainPage
// Copyright: @2012 Tim Evans
// ==========================================================================
/*globals ReadingList */
require('views/feed');

ReadingList.mainPage = SC.Page.design({
  mainPane: SC.MainPane.design({
    childViews: ['split'],

    split: SC.SplitView.design({
      childViews: ['list', 'deck'],
      dividerThickness: 1,
      canCollapseViews: NO,
      topLeftMinThickness: 250,
      topLeftView: ReadingList.FeedView.design({
        layout: { left: 0, width: 250 }
      }),

      bottomRightView: ReadingList.DeckView.design({
        childViews: ['feed', 'entry'],
        layout: { left: 250, right: 0, top: 0, bottom: 0 },
        feed: ReadingList.CardView.design({
          layout: { left: 0, width: 250, borderRight: 1 },
          contentView: SC.ScrollView.design({
            contentView: SC.SourceListView.design({
              rowHeight: 55,
              contentBinding: SC.Binding.oneWay('ReadingList.entriesController'),
              selectionBinding: 'ReadingList.entriesController.selection',
              exampleView: SC.LabelView.design({
                needsEllipsis: YES,
                valueBinding: SC.Binding.oneWay('.content.title')
              })
            })
          })
        }),
        entry: SC.View.design({
          layout: { left: 250 },
          contentBinding: SC.Binding.oneWay('ReadingList.entriesController*selection.firstObject').single(),
          contentDidChange: function () {
            var content = this.get('content'),
                view = this, View;

            View = SC.View.extend({
              classNames: ['scrollable'],
              wantsAcceleratedLayer: YES,
              layout: {
                left: -1 * SC.getPath(view, 'frame.width'),
                right: SC.getPath(view, 'frame.width')
              },
              childViews: [ReadingList.PageView.extend({
                content: content,
                parentFrameBinding: SC.Binding.oneWay('.parentView.frame'),
                layout: function () {
                  var height = SC.getPath(this, 'parentFrame.height');
                  height = height
                           ? height - 100
                           : 0;
                  return { minHeight: height };
                }.property('parentFrame').cacheable()
              })]
            });

            if (content != null) {
              view = this.createChildView(View);
              this.set('contentView', view);
              this.replaceAllChildren([view]);
              setTimeout(function () {
                view.animate({ 
                  left: 0,
                  right: 0
                }, {
                  timing: 'ease-out',
                  duration: .25
                });
              }, 0);
            } else {
              view = this.get('contentView');
              view.animate({ 
                left: -1 * SC.getPath(view, 'frame.width'),
                right: SC.getPath(view, 'frame.width')
              }, {
                timing: 'ease-out',
                duration: .25
              });
            }
          }.observes('content')
        })
      })
    })
  })
});
