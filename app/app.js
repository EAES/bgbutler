(function(){
'use strict'

angular
	
	.module('bgbutler', [
		'ui.router',
		'home'
	])

	.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

		$locationProvider.html5Mode(true).hashPrefix('!');

		$urlRouterProvider
			.otherwise('/');
	}])

})();
