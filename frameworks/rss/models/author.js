require('core');

RSS.Author = SC.Record.extend(
  /** @scope RSS.Author.prototype */{

  primaryKey: 'fullName',

  /**
    The full name of the author.
    @field
    @type String
   */
  fullName: SC.Record.attr(String, {
    key: 'value'
  }),

  /**
    The entries that were written by this author.
    @field
    @type RSS.Entry[]
   */
  entries: SC.Record.toMany('RSS.Entry', {
    inverse: 'author'
  })

});
