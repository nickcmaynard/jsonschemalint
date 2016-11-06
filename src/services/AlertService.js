'use strict';

var app = angular.module('app', false);

app.service('alertService', function ($q, $uibModal) {

  this.alert = function (params) {
    if (!params) {
      return $q.reject("params required");
    }
    return $uibModal.open({
      animation: false,
      template: '<div class="modal-header"><h3 class="modal-title" id="modal-title">' + params.title + '</h3></div><div class="modal-body" id="modal-body">' + params.message + '</div><div class="modal-footer"><button class="btn ' + (params.btnClass || "btn-primary") + '" type="button" ng-click="$close()">OK</button></div>',
      ariaLabelledBy: 'modal-title-top',
      ariaDescribedBy: 'modal-body',
      controller: function ($scope) {},
      size: "sm"
    }).result;
  };

});