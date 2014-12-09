angular.module('ReviewApp')
    .controller('ReviewController', function ($scope, $rootScope, $http, $log) {
        $rootScope.PAGE = "all";

        $scope.showNames = true;
        
        $scope.types = [];

        $http.get('data/data.json')
            .success(function(data) {
                $log.debug('Data retreived: ', data);
                $scope.types = data;
            })
            .error(function(error) {
                $log.error('An error has occored: ', error);
            });

        $scope.nameVisable = true;

        $scope.toggleNames = function() {
            $scope.showNames = ($scope.showNames == true ? false : true);
        };
    });
