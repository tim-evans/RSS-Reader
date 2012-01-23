require('core');

RSS.Feed = SC.Record.extend(
  /** @scope RSS.Feed.prototype */{

  primaryKey: 'feedURL',

  feedURL: SC.Record.attr(String, {
    key: 'feedUrl'
  }),

  title: SC.Record.attr(String),

  link: SC.Record.attr(String),

  description: SC.Record.attr(String),

  entries: SC.Record.toMany('RSS.Entry', {
    isNested: YES
  })
});
