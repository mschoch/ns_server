angular.module('mnViews').controller('mnViewsCopyDialogController',
  function ($scope, $modal, $state, mnViewsService, mnHelper, $modalInstance, currentDdoc) {
    $scope.ddoc = {};
    $scope.ddoc.name = mnViewsService.cutOffDesignPrefix(currentDdoc.meta.id);
    function prepareToCopy(url, ddoc) {
      return function () {
        return mnViewsService.createDdoc(url, ddoc).then(function () {
          $modalInstance.close();
          $state.go('app.admin.views', {
            type: 'development'
          });
        });
      };
    }
    $scope.onSubmit = function () {
      var url = mnViewsService.getDdocUrl($scope.views.bucketsNames.selected, "_design/dev_" + $scope.ddoc.name);
      var copy = prepareToCopy(url, currentDdoc.json);
      var promise = mnViewsService.getDdoc(url).then(function (presentDdoc) {
        return $modal.open({
          templateUrl: '/angular/app/mn_admin/mn_views/confirm_dialogs/mn_views_confirm_override_dialog.html'
        }).result.then(copy);
      }, copy);

      mnHelper.showSpinner($scope, promise);
    };
  });
