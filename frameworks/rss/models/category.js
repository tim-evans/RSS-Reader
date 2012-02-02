require('core');

RSS.Category = SC.Record.extend(
  /** @scope RSS.Category.prototype */{

  primaryKey: 'value',

  /**
    The category name.
    @field
    @type String
   */
  value: SC.Record.attr(String),

  /**
    The entries that are tagged with this category.
    @field
    @type RSS.Entry[]
   */
  entries: SC.Record.toMany('RSS.Entry', {
    inverse: 'categories'
  })

});
