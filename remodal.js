"use strict";


function RemodalManager() {
  this._templateName = new ReactiveVar();
  this._data = new ReactiveVar(EJSON.stringify(null));
  this._target = new ReactiveVar(null);
  this._closeTimer = null;
}

_.extend(RemodalManager.prototype, {
  getTemplateName: function (nonReactive){
    var self = this;
    if (nonReactive){
      return Tracker.nonreactive(function(){ return self._templateName.get(); })
    } else {
      return self._templateName.get();
    }
  },
  get: function (nonReactive) {
    var self = this,
      $sel,
      templateName = self.getTemplateName(nonReactive);
    if (templateName == null) {
      return;
    }
    $sel = $("#" + templateName + ".modal");
    if ($sel.length !== 1) {
      return;
    }
    return $sel;
  },

  isOpen: function (nonReactive) {
    var self = this;
    return self.getTemplateName(nonReactive) != null;
  },
  isModal: function (templateName, nonReactive) {
    var self = this;
    return self.getTemplateName(nonReactive) === templateName;
  },
  open: function (templateName, data, beforeShown) {
    var self = this, $currentModal, doOpen;
    if (data == null) {
      data = {};
    }
    if (beforeShown == null) {
      beforeShown = null;
    }
    if (self.isModal(templateName, true)) {
      return;
    }
    doOpen = function () {
      var $modal;
      self._templateName.set(templateName);
      self._data.set(EJSON.stringify(data));
      Tracker.flush();
      $modal = self.get(true);
      if ($modal == null) {
        return;
      }
      $modal.one('shown.bs.modal', function () {
        $modal.find(':input:visible[autofocus]').first().focus();
      });
      $modal.one('hidden.bs.modal', function () {
        self.reset();
      });
      if (beforeShown != null) {
        beforeShown($modal);
      }
      $modal.modal("show");
    };
    $currentModal = self.get(true);
    if ($currentModal != null) {
      $currentModal.one('hidden.bs.modal', function () {
        doOpen();
      });
      $currentModal.modal('hide');
    } else {
      Meteor.defer(doOpen);
    }
  },
  reset: function () {
    var self = this;
    self._templateName.set(null);
    self._data.set(EJSON.stringify(null));
    if (self._closeTimer) {
      Meteor.clearTimeout(self._closeTimer);
    }
    self._closeTimer = null;
  },
  resetTarget: function () {
    var self = this;
    self._target.set(null);
  },
  setTarget: function (target) {
    var self = this;
    self._target.set(target);
  },
  close: function () {
    var _ref;
    if ((_ref = this.get(true)) != null) {
      _ref.modal('hide');
    }
  },
  deferClose: function (timeout) {
    var self = this;
    if (self._closeTimer) {
      Meteor.clearTimeout(self._closeTimer);
    }
    this._closeTimer = Meteor.setTimeout(function () {
      return self.close();
    }, timeout);
  },
  fastReset: function () {
    var self = this,
        currentModal = self.get(true);
    if (currentModal != null) {
      currentModal.off('hidden.bs.modal').removeClass('fade').modal('hide');
    }
    self.reset();
    self.resetTarget();
  },
  data: function () {
    return EJSON.parse(this._data.get());
  }
});

Remodal = new RemodalManager();

$(window).on('popstate', function () {
  if (Remodal.isOpen()) {
    Remodal.close();
  }
});

Template.remodal.helpers({
  remodalData: function (target) {
    if (Remodal._target.get() == (target != null ? target : null)) {
      return EJSON.parse(Remodal._data.get());
    }
  },
  _remodal: function () {
    var templateName;
    templateName = Remodal._templateName.get();
    if ((templateName != null) && (Template[templateName] != null)) {
      return Template[templateName];
    }
    return null;
  }
});

// Automatically close modal if the user changes route
if (Meteor.isClient && Package['iron:router'] != null){
  Package['iron:router'].Router.onRun(function() {
    Remodal.fastReset();
    this.next();
  });
}
