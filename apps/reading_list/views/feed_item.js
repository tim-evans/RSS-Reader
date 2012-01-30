ReadingList.FeedItemView = SC.View.extend({

  classNames: ['feed-item'],

  classNameBindings: ['hasIcon'],

  needsEllipsis: YES,

  hasIconBinding: SC.Binding.oneWay('SC.userDefaults*hasIcon'),

  defaultIcon: sc_static('feed_item/icn_default-buddy.png'),

  iconBinding: SC.Binding.oneWay('*content.link').transform(
    function (url) {
      return url && (url + '/favicon.ico');
    }),

  titleBinding: SC.Binding.oneWay('*content.title'),

  authorBinding: SC.Binding.oneWay('*content.author'),

  descriptionBinding: SC.Binding.oneWay('*content.description'),

  detail: function () {
    return this.get('author') || this.get('description');
  }.property('author', 'description').cacheable(),

  displayProperties: ['title', 'icon', 'detail', 'needsEllipsis', 'isSelected'],

  render: function (context) {
    var ellipsis = this.get('needsEllipsis')
                   ? ' ellipsis'
                   : '',
        icon = this.get('icon') || this.get('defaultIcon');

    context.setClass('sel', this.get('isSelected'));
    context.push('<img src="' + icon + '" class="icon"/>',
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
      $.find('.icon').attr('src', this.get('icon') || this.get('defaultIcon'));
    }

    if (this.didChangeFor(K, 'title')) {
      $.find('.title').html(this.get('title'));
    }

    if (this.didChangeFor(K, 'detail')) {
      $.find('.detail').html(this.get('detail'));
    }
  }

});
