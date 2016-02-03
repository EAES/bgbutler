(function(){
'use strict'

angular
	.module('bgbutler')
	
	.service('homeService', function($http, $log){

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

})();