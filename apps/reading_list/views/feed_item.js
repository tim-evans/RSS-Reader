ReadingList.FeedItemView = SC.View.extend({

  classNames: ['feed-item'],

  needsEllipsis: NO,

  icon: null,

  title: null,

  detail: null,

  displayProperties: ['title', 'icon', 'detail', 'needsEllipsis', 'isSelected'],

  render: function (context) {
    var ellipsis = this.get('needsEllipsis')
                   ? ' ellipsis'
                   : '';

    context.setClass('sel', this.get('isSelected'));
    context.push('<img src="' + this.get('icon') + '" class="icon"/>',
                 '<span class="title' + ellipsis +'">' + this.get('title') + '</span>',
                 '<span class="detail' + ellipsis +'">' + this.get('detail') + '</span>');
  },

  update: function ($) {
    var K = 'FeedItemView';

    if (this.didChangeFor(K, 'isSelected')) {
      $.setClass('sel', this.get('isSelected'));
    }

    if (this.didChangeFor(K, 'needsEllipsis')) {
      $.find('.title').setClass('ellipsis', this.get('needsEllipsis'));
      $.find('.detail').setClass('ellipsis', this.get('needsEllipsis'));
    }

    if (this.didChangeFor(K, 'icon')) {
      $.find('.icon').attr('src', this.get('icon'));
    }

    if (this.didChangeFor(K, 'title')) {
      $.find('.title').html(this.get('title'));
    }

    if (this.didChangeFor(K, 'detail')) {
      $.find('.detail').html(this.get('detail'));
    }
  }

});
