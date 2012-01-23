require('core');

RSS.Entry = SC.Record.extend(
  /** @scope RSS.Entry.prototype */{

  primaryKey: 'link',

  author: SC.Record.attr(String),

  title: SC.Record.attr(String),

  link: SC.Record.attr(String),

  published: SC.Record.attr(SC.DateTime, {
    key: 'publishedDate',
    transform: {
      to: function (dateString) {
        return SC.DateTime.create(Date.parse(dateString));
      }
    }
  }),

  summary: SC.Record.attr(String, {
    key: 'contentSnippet'
  }),

  content: SC.Record.attr(String)

});