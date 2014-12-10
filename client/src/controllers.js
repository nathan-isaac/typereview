angular.module('ReviewApp')
    .controller('ReviewController', function ($scope, $rootScope, $http, $log) {
        $rootScope.PAGE = "all";

        $scope.showNames = true;
        
        $scope.types = [];

        $scope.quizFilter = "";

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

        $scope.toggleQuiz = function() {

            switch($scope.quizFilter) {
                case "quiz1":
                    $scope.quizFilter = "quiz2";
                    break;
                case "quiz2"
                    $scope.quizFilter = "";
                    break;
                case "":
                    $scope.quizFilter = "quiz1";
                    break;
            }
        };

        
    });
