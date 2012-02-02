require('core');

RSS.Entry = SC.Record.extend(
  /** @scope RSS.Entry.prototype */{

  primaryKey: 'link',

  author: SC.Record.toOne('RSS.Author'),

  title: SC.Record.attr(String),

  link: SC.Record.attr(String),

  published: SC.Record.attr(Date, {
    key: 'publishedDate',
    transform: {
      to: function (dateString) {
        return new Date(Date.parse(dateString));
      }
    }
  }),

  summary: SC.Record.attr(String, {
    key: 'contentSnippet'
  }),

  content: SC.Record.attr(String),

  categories: SC.Record.toMany('RSS.Category')

});
