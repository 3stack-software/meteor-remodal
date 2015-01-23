"use strict";


function RemodalManager() {
  this._templateName = new ReactiveVar();
  this._data = new ReactiveVar(EJSON.stringify(null));
  this._target = new ReactiveVar(null);
  this._closeTimer = null;
}

_.extend(RemodalManager.prototype, {
  get: function () {
    var $sel, templateName;
    templateName = this._templateName.get(false);
    if (templateName == null) {
      return;
    }
    $sel = $("#" + templateName + ".modal");
    if ($sel.length !== 1) {
      return;
    }
    return $sel;
  },

  isOpen: function () {
    return !this._templateName.equals(null);
  },
  isModal: function (templateName) {
    return this._templateName.equals(templateName);
  },
  open: function (templateName, data, beforeShown) {
    var self = this, $currentModal, doOpen;
    if (data == null) {
      data = {};
    }
    if (beforeShown == null) {
      beforeShown = null;
    }
    if (self.isModal(templateName)) {
      return;
    }
    doOpen = function () {
      var $modal;
      self._templateName.set(templateName);
      self._data.set(EJSON.stringify(data));
      Tracker.flush();
      $modal = self.get();
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
    $currentModal = Remodal.get();
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
    this._templateName.set(null);
    this._data.set(EJSON.stringify(null));
    if (this._closeTimer) {
      Meteor.clearTimeout(this._closeTimer);
    }
    this._closeTimer = null;
  },
  resetTarget: function () {
    this._target.set(null);
  },
  setTarget: function (target) {
    return this._target.set(target);
  },
  close: function () {
    var _ref;
    if ((_ref = Remodal.get()) != null) {
      _ref.modal('hide');
    }
  },
  deferClose: function (timeout) {
    if (this._closeTimer) {
      Meteor.clearTimeout(this._closeTimer);
    }
    this._closeTimer = Meteor.setTimeout(function () {
      return Remodal.close();
    }, timeout);
  },
  fastReset: function () {
    var _ref;
    if ((_ref = Remodal.get()) != null) {
      _ref.off('hidden.bs.modal').removeClass('fade').modal('hide');
    }
    Remodal.reset();
    Remodal.resetTarget();
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
    if (Remodal._target.equals(target != null ? target : null)) {
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

