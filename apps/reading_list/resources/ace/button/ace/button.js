require('theme');

ReadingList.Theme.buttonRenderDelegate = SC.AceTheme.buttonRenderDelegate.extend({
  render: function (dataSource, context) {
    this.addSizeClassName(dataSource, context);
    
    var labelContent,
        toolTip     = dataSource.get('toolTip'),
        isSelected  = dataSource.get('isSelected') || NO,
        isActive    = dataSource.get('isActive') || NO,
        isDefault   = dataSource.get('isDefault') || NO,
        isCancel    = dataSource.get('isCancel') || NO,
        isToggle    = dataSource.get('isToggle') || NO,
        labelId     = SC.guidFor(dataSource) + '-label';

    context.setClass({
      'icon': !!dataSource.get('icon'),
      'def':  isDefault,
      'cancel': isCancel && !isDefault,
      'active': isActive,
      'sel': isSelected
    });

    if (toolTip) {
      context.attr('title', toolTip);
      context.attr('alt', toolTip);
    }
    
    // accessibility
    if(dataSource.get('isSegment')){
      context.attr('aria-selected', isSelected.toString());
    }else if(isToggle) {
      context.attr('aria-pressed', isActive.toString());
    } 
    
    context.attr('aria-labelledby', labelId);

    // Create the inner label element that contains the text and, optionally,
    // an icon.
    context = context.begin('label').addClass('sc-button-label').id(labelId);
    dataSource.get('theme').labelRenderDelegate.render(dataSource, context);
    context = context.end();
  }

});
