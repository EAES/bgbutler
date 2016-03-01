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
				})
				.state('home.selectedgame',{
					url: ":name",
					views: {
						'serving-area@home': {
							templateUrl: function(params) {return 'data/' + params.name + '.html'; }
						}
					}
				});

	}])

	.controller('HomeController',[
		'homeService',
		'bggService',
		'matchService',
		'localStorageService',
		'$scope',
		'$log',
		'$location',
		'$state',
		function(
			homeService,
			bggService,
			matchService,
			localStorageService,
			$scope,
			$log,
			$location,
			$state
		){

		var mainCollection = [];
		var user = bggService.bggName;
		var localHouseCollection = localStorageService.get("localHouseCollection");
		var localHouseCollectionCacheTime = localStorageService.get("localHouseCollectionCacheTime");
		var today = Math.floor((Date.now()/60000)/60);

		var getLocal = function(){
			homeService.getCollection().then(function(response){
				$scope.houseCollection =  response.data;
				mainCollection = response.data;
				console.log('saving collection to localstorage');
				localStorageService.set("localHouseCollection", response.data);
				localStorageService.set("localHouseCollectionCacheTime", Math.floor((Date.now()/60000)/60));
			});
		}

		if(localHouseCollection !== null){

			if (localHouseCollectionCacheTime >= (today+48) ) {
				console.log('collection is too old, deleting...');
				localStorageService.remove("localHouseCollection");
				localStorageService.remove("localHouseCollectionCacheTime");

				console.log('loading new collection with timestamp');
				getLocal();

			} else {
				console.log('loading collection from localStorage');
				$scope.houseCollection =  mainCollection = localHouseCollection;
			}
		} else if (localHouseCollection === null) {
			getLocal();

		}



		var getBgg = function(){
			bggService.getCollection($scope.bggUser)
				.then(function(response){

					var arrA = mainCollection;
					var arrB = bggService.putInCollection(response.data);
					var user = bggService.bggName;

					$scope.houseCollection = matchService.getMatches(arrA, arrB);
					$scope.personalGreeting = (user + "\'s games");
					localStorageService.set(user+"localBggCollection", $scope.houseCollection);
					localStorageService.set(user+"localBggCollectionCacheTime", Math.floor((Date.now()/60000)/60));
					$scope.connectbgg = false;

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
					} else if (bggService.status === 'Error, please try again'){
						localStorageService.remove(user+"localBggCollection");
					} else {
						$scope.matchInfo = '';
					}
				});
		};

		$scope.getBggCollection = function(){
			$scope.bggInfo = bggService;
			$scope.matchInfo = '';
			var user = $scope.bggUser;
			var localBggCollection = localStorageService.get(user+"localBggCollection");
			var localBggCollectionCacheTime = localStorageService.get(user+"localBggCollectionCacheTime");

			if(localBggCollection !== null){
				if (localBggCollectionCacheTime >= (today+1) ) {
					console.log('bggcollection is too old, deleting...');
					localStorageService.remove("localBggCollection");
					localStorageService.remove("localBggCollectionCacheTime");

					console.log('loading new collection with timestamp');
					getBgg();
				} else {
					console.log('loading bggcollection from localStorage');

					$scope.personalGreeting = (user + "\'s games");
					$scope.houseCollection = localBggCollection;
					$("#gameselect").prop("selectedIndex", 0);
					$scope.connectbgg = false;
				}
			} else if (localBggCollection === null){
				getBgg();
			}


		}

		$scope.gameChange = function(){
			if($scope.selectedGame !== null){
				var location = $scope.selectedGame.name;
				console.log('ding!');

				if (location){
					$state.go('home.selectedgame',{name: location.replace(/\s/g, '-').replace(/:/g, '').toLowerCase()});
				}
			}
		}



}]);

})();
