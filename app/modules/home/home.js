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

	.controller('HomeController',[
		'homeService',
		'bggService',
		'matchService',
		'$scope',
		'$log',
		function(
			homeService,
			bggService,
			matchService,
			$scope,
			$log
		){

		var mainCollection = [];
		
		homeService.getCollection().then(function(response){
			$scope.houseCollection =  response.data;
			mainCollection = response.data;
		});

		$scope.getBggCollection = function(){
			

			bggService.getCollection($scope.bggUser)
				.then(function(response){
					
					var arrA = mainCollection;
					var arrB = bggService.putInCollection(response.data);

					$scope.houseCollection = matchService.getMatches(arrA, arrB);
					
					

				})

		}
	}]);

})();
