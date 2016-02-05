(function(){
'use strict'

angular
	.module('bgbutler')
	.service('matchService', function(){

		

		this.getMatches = function(arrA, arrB){
			var matches = [];
			angular.forEach(arrA, function(val1, key1){
				angular.forEach(arrB, function(val2, key2){
					if (val1.name === val2.name){
						matches.push(val1);
						console.log(val1.name);
					}
				});
			})

			return matches;
		}

	});
})();