angular.module('ReviewApp', ['ngRoute', 'ngResource', 'ngMessages'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/review', {
                controller: 'ReviewController',
                templateUrl: 'views/review.html'
            })
            .when('/design', {
                controller: 'DesignController',
                templateUrl: 'views/design.html'
            })
            .otherwise({
                redirectTo: '/review'   
            });
    });
