var app = angular.module('bgbutler', []);

app.service('houseCollectionService', function($http, $log){

	this.getCollection =  function(){
		var promise = $http({method: 'GET',url: 'data/games.json'});
		promise.then(function success(response) {
			return response.data;		    
		  },
		  function error(response) {
		    $log.log("can't get house collection");
		  });

		return promise;
	}
	
});

app.service('BggCollectionService', function($http, $log){

	var collection = [];
	this.getCollection = function(bggUser){

		$http({
            method  : 'GET',
            url     : 'https://cors-anywhere.herokuapp.com/https://www.boardgamegeek.com/xmlapi2/collection?username='+bggUser+'&subtype=boardgame&stats=1',
            timeout : 10000,
            params  : {}, 
            transformResponse : function(data) {
                return $.parseXML(data);
            }
        })
        .success(function(data, status) {

        	$(data).find('item').each(function () {
	    		if($(this).find('status').attr('own') === '1') {
	        		var item={
						id: $(this).attr('objectid'),
						name: $(this).find('name').text(),
						thumbnail: $(this).find('thumbnail').text(),
						yearpublished: $(this).find('yearpublished').text()
					};
					
					collection.push(item);
	        	}
	    	});
            
        })
        .error(function(data, status) {
            $log.error('error');
        });
		
		return  collection;
	}
});

app.controller('GameController', ['$scope','$log','houseCollectionService','BggCollectionService', function($scope, $log, houseCollectionService, BggCollectionService){

	//$scope.bggCollection =  BggCollectionService.getCollection("homemadehugmachine");
	houseCollectionService.getCollection().then(function(response){
		$scope.houseCollection =  response.data;
	});

	$scope.getBggCollection = function(){
		$log.log($scope.bggUser);
		$scope.houseCollection = BggCollectionService.getCollection($scope.bggUser);
	}
}]);

app.controller('GuideController', ['$scope', function($scope){
}]);