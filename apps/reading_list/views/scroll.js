/**
  OSX Lion style scrollbars.
 */
SC.ScrollerView.reopen({

  scrollbarThickness: 12,

  buttonLength: 5,

  capLength: 12,

  hasButtons: NO,

  render: function (original, context, firstTime) {
    if (!this._suppressActiveChecks) {
      if (!this._isThumbActive) {
        this._isTrackActive = this._isHovering;
        this._isThumbActive = true;
      }

      if (this._activeTimer) {
        this._activeTimer.invalidate();
      }

      this._activeTimer = SC.Timer.schedule({
        target: this,
        action: '_thumbDidBecomeInactive',
        interval: 1000
      });
    } else {
      this._suppressActiveChecks = NO;
    }

    context.setClass('active-track', !!(this._thumbDragging || this._isTrackActive));
    context.setClass('active-thumb', !!(this._thumbDragging || this._isThumbActive));
    return original(context, firstTime);
  }.enhance(),

  _thumbDidBecomeInactive: function () {
    if (!this._isHovering) {
      this._isTrackActive = false;
      this._isThumbActive = false;
      this._activeTimer = null;
      this._suppressActiveChecks = YES;
      this.displayDidChange();
    } else {
      this._hideOnMouseOut = true;
    }
  },

  mouseEntered: function () {
    this._isHovering = true;
    if (!this._isTrackActive && this._isThumbActive) {
      this._isTrackActive = true;
      this._suppressActiveChecks = YES;
      this.displayDidChange();
    }
  },

  mouseExited: function () {
    this._isHovering = false;
    if (this._hideOnMouseOut) {
      this.displayDidChange();
      this._hideOnMouseOut = false;
    }
  },

  mouseUp: function (original, evt) {
    var wasDraggingThumb = this._thumbDragging,
        ret = original(evt);
    if (wasDraggingThumb && !this._thumbDragging) {
      this._suppressActiveChecks = YES;
      this.displayDidChange();
    }
  }.enhance()
});

SC.mixin(SC.ScrollView.prototype, {
  verticalOverlay: YES
});
