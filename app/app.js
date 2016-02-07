(function(){
'use strict'

angular
	
	.module('bgbutler', [
		'ui.router',
		'LocalStorageModule',
		'home'
	])

	.config(['$stateProvider','$urlRouterProvider','$locationProvider','localStorageServiceProvider', function($stateProvider, $urlRouterProvider, $locationProvider, localStorageServiceProvider){

		$locationProvider.html5Mode(true).hashPrefix('!');
		$urlRouterProvider
			.otherwise('/');

		localStorageServiceProvider.setPrefix('bgbutler');
	}])

})();
