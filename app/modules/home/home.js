(function(){
'use strict'

angular
	.module('home', [])

	.config(['$stateProvider','$urlRouterProvider', function($stateProvider){
		$stateProvider
				.state('home', {
					url: "/",
					templateUrl: 'app/modules/home/home.html',
					controller: 'HomeController'
				});

	}])

	.controller('HomeController', ['homeService','bggService','$scope','$log', function(homeService, bggService, $scope, $log){
		
		homeService.getCollection().then(function(response){
			$scope.houseCollection =  response.data;
		});

		$scope.getBggCollection = function(){
			bggService.getCollection($scope.bggUser)
				.then(function(response){
					$scope.houseCollection = bggService.putInCollection(response.data);

				})

		}
	}]);

})();
