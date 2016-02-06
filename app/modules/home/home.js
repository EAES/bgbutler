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

			$scope.bggInfo = bggService;
			$scope.matchInfo = '';
			
			bggService.getCollection($scope.bggUser)

				.then(function(response){
					
					var arrA = mainCollection;
					var arrB = bggService.putInCollection(response.data);
					var user = bggService.bggName;

					$scope.houseCollection = matchService.getMatches(arrA, arrB);
					$scope.personalGreeting = (user + "\'s games");

					if(($scope.houseCollection).length === 0 && bggService.status === ''){
						$scope.personalGreeting = '';
						$scope.houseCollection = mainCollection;
						$scope.matchInfo = 'Sorry, we don\'t have any of your games right now.';

					} if(($scope.houseCollection).length > 0 && bggService.status === ''){
						$("#gameselect").prop("selectedIndex", 0);

					} else if(
						bggService.status === 'Invalid username' || 'No games found'){
							$scope.personalGreeting = '';
							$scope.houseCollection = mainCollection;
							
					} else {
						$scope.matchInfo = '';
					}
				})

		}
}]);

})();
