var app = angular.module('bgbutler', []);

app.service('houseCollectionService', function($http, $log){

	var houseCollection = new Array;

	this.getCollection =  function(){
		$http({
		  method: 'GET',
		  url: 'data/games.json'
		}).then(function successCallback(response) {
			for(var i = 0; i < response.data.length; i++) {
				houseCollection.push(response.data[i]);
			};
		    
		  }, function errorCallback(response) {
		    $log.log("can't get house collection");
		  });

		return houseCollection;
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
        	// $log.info('success');
        	// $log.info(status);

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

app.controller('GameController', ['$scope','houseCollectionService','BggCollectionService', function($scope, houseCollectionService, BggCollectionService){
	
	$scope.bggCollection =  BggCollectionService.getCollection("homemadehugmachine");
	$scope.houseCollection =  houseCollectionService.getCollection();
}]);

app.controller('GuideController', ['$scope', function($scope){
}]);