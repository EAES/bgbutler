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
		'localStorageService',
		'$scope',
		'$log',
		function(
			homeService,
			bggService,
			matchService,
			localStorageService,
			$scope,
			$log
		){

		var mainCollection = [];
		var localHouseCollection = localStorageService.get("localHouseCollection");
		var localHouseCollectionCacheTime = localStorageService.get("localHouseCollectionCacheTime");
		var today = Math.floor((Date.now()/60000)/60);


		if(localHouseCollection !== null){

			if (localHouseCollectionCacheTime >= (today+48) ) {
				console.log('collection is too old, deleting...');
				localStorageService.remove("localHouseCollection");
				localStorageService.remove("localHouseCollectionCacheTime");

				console.log('loading new collection with timestamp');
				homeService.getCollection().then(function(response){
					$scope.houseCollection =  response.data;
					mainCollection = response.data;
					console.log('saving collection to localstorage');
					localStorageService.set("localHouseCollection", response.data);
					localStorageService.set("localHouseCollectionCacheTime", Math.floor((Date.now()/60000)/60));
				});
			} else {
				console.log('loading collection from localStorage');
				$scope.houseCollection =  localHouseCollection;
				mainCollection = localHouseCollection;
			}
		}

		
		

		$scope.getBggCollection = function(){

			//check for bgg collection in localstorage
			//if older than a day purge and download new one
			//else load collection from localstorage

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

					} else if(($scope.houseCollection).length > 0 && bggService.status === ''){
						$("#gameselect").prop("selectedIndex", 0);
					} else if(
						bggService.status === 'Invalid username' || 'No games found'){
							$scope.personalGreeting = '';
							$scope.houseCollection = mainCollection;
					} else {
						$scope.matchInfo = '';
					}
				});

		}
}]);

})();
