(function(){
'use strict'

angular
	.module('bgbutler')
	.service('bggService', function($http, $log, $timeout){

	var self = this;
	var collection = [];
	this.bggName = '';

	this.getCollection = function(bggUser){
		self.bggName = bggUser
		self.status = 'Loading...';
		var result = '';
		var promise = $http({
            method  : 'GET',
            url     : 'https://cors-anywhere.herokuapp.com/https://www.boardgamegeek.com/xmlapi2/collection?username='+bggUser+'&subtype=boardgame&stats=1',
            timeout : 2000,
            params  : {}, 
            transformResponse : function(data) {
                return $.parseXML(data);
            }
        });
        
        promise.then(function success(response) {
        	console.log(self.bggName);
        	// response.status = 202;
        	if (response.status === 202) {
        		// console.log('let\'s try again...');
        		self.status = 'Please wait...';
        		$timeout(function() {
        			self.getCollection(self.bggName);
        		}, 500);

        	} else if($(response.data).find('items').attr('totalitems') === '0') {
        		console.log(response.data);
        		self.status = 'No games found';

        	} else if ($(response.data).find('errors').find('error').find('message').text() === "Invalid username specified") {
        		self.status = 'Invalid username';

        	} else {
        		self.status = '';
        		return response.data;
        	}
            
        }, function error(response) {
            // $log.error(response.data);
            self.status = "Error, please try again";
            $log.error(response.status);
            $log.error(response);
        	}
        );
		
		return  promise;
	}

	this.putInCollection = function(data){
		collection.length = 0;
		$(data).find('item').each(function () {
			if($(this).find('status').attr('own') === '1') {
	    		var item={
					id: $(this).attr('objectid'),
					name: $(this).find('name').text(),
					thumbnail: $(this).find('thumbnail').text(),
					yearpublished: $(this).find('yearpublished').text()
				}
				collection.push(item);
	    	} else {
	    		console.log('not a match');
	    	}
		});

		return collection;
	}

});
})();