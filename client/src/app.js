angular.module('ReviewApp', ['ngRoute', 'ngResource', 'ngMessages'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/review', {
                controller: 'ReviewController',
                templateUrl: 'views/review.html'
            })
            .otherwise({
                redirectTo: '/review'   
            });
    });
