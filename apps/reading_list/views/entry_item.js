ReadingList.EntryItemView = SC.View.extend({

  classNames: ['entry-item'],

  displayProperties: ['content', 'isSelected'],

  render: function (context) {
    var content = this.getPath('content'),
        title = SC.get(content, 'title'),
        author = SC.getPath(content, 'author.fullName'),
        published = SC.get(content, 'published').toLocaleDateString(),
        categories = SC.get(content, 'categories').getEach('value').join(', ');

    context.setClass('sel', this.get('isSelected'));
    context.push('<span class="title ellipsis"><span>' + title + '</span></span>',
                 '<span class="detail">' + author + '</span>',
                 '<span class="timestamp">' + published + '</span>',
                 '<span class="labels">' + categories + '</span>');
  },

  update: function ($) {
    var K = 'EntryItemView';

    $.setClass('sel', this.get('isSelected'));

    if (this.didChangeFor(K, 'content')) {
      var content = this.getPath('content'),
          title = SC.get(content, 'title'),
          author = SC.getPath(content, 'author.fullName'),
          published = SC.get(content, 'published').toLocaleDateString(),
          categories = SC.get(content, 'categories').getEach('value').join(', ');

      $.find('.title span').html(title);
      $.find('.detail').html(author);
      $.find('.timestamp').html(published);
      $.find('.labels').html(categories);
    }
  }

});
