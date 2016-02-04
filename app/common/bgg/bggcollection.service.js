(function(){
'use strict'

angular
	.module('bgbutler')
	.service('bggService', function($http, $log){

	var self = this;
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
        	self.putInCollection(data);
            
        })
        .error(function(data, status) {
            $log.error('error');
        });
		
		return  collection;
	}

	this.putInCollection = function(data){
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
	}

});
})();