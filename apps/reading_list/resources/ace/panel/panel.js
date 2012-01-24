require('theme');

ReadingList.Theme.panelRenderDelegate = SC.RenderDelegate.create({
  className: 'panel',

  render: function(dataSource, context) {
    var ariaLabel = dataSource.get('ariaLabel'),
        ariaLabelledBy = dataSource.get('ariaLabelledBy'),
        ariaDescribedBy = dataSource.get('ariaDescribedBy');
    
    if(ariaLabel) context.attr('aria-label', ariaLabel);
    if (ariaLabelledBy) context.attr('aria-labelledby', ariaLabelledBy);
    if (ariaDescribedBy) context.attr('aria-describedby', ariaDescribedBy);
  },

  update: function(dataSource, jQuery) {
    // the label for the panel could change...
    var ariaLabel = dataSource.get('ariaLabel'),
        ariaLabelledBy = dataSource.get('ariaLabelledBy'),
        ariaDescribedBy = dataSource.get('ariaDescribedBy');
    
    if(ariaLabel) jQuery.attr('aria-label', ariaLabel);
    if(ariaLabelledBy) jQuery.attr('aria-labelledby', ariaLabelledBy);
    if(ariaDescribedBy) jQuery.attr('aria-describedby', ariaDescribedBy);
  }
});