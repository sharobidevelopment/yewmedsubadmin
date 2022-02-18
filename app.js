/**
 * 
 */
'use strict';
var applog = angular.module('myApp',['ngRoute','ui.bootstrap','ngCookies','ngIdle','infinite-scroll', 'angularjs-dropdown-multiselect']);
applog.config([ '$routeProvider', '$locationProvider','IdleProvider', 'KeepaliveProvider',
    function($routeProvider, $locationProvider,IdleProvider, KeepaliveProvider) {
	
	var contextpath='/yewmedsubadmin';
        $routeProvider.when('/yewmedsubadmin/', {
            templateUrl : 'views/login.html',
        }).when(contextpath+"/orders", {
            templateUrl : "views/orders.html"
        }).when(contextpath+"/home", {
			     templateUrl : "views/home.html"
		    }).when(contextpath+"/orderhistory", {
           templateUrl : "views/orderhistory.html"
        }).when(contextpath+"/acceptedorders", {
           templateUrl : "views/acceptedorder.html"
        }).when(contextpath+"/dispatchorders", {
           templateUrl : "views/dispatchedorder.html"
        }).when(contextpath+"/deliveredorders", {
           templateUrl : "views/delivered_order.html"
        }).when(contextpath+"/adddeliveryperson", {
           templateUrl : "views/delivery_person.html"
        }).when(contextpath+"/deliverypersonlist", {
           templateUrl : "views/deliverpersonlist.html"
        }).when(contextpath+"/editdeliveryperson", {
           templateUrl : "views/editdeliveryperson.html"
        }).otherwise({
            redirectTo : '/yewmedsubadmin'
        });
      
      $locationProvider.html5Mode({
        	  enabled: true,
        	  requireBase: false
        	});/*For avoid #! from url*/

     }

    
  
]).run(function(Idle,$rootScope){
	// start watching when the app runs. also starts the Keepalive service by default.
    Idle.watch();
   
      $rootScope.lat=0;
      $rootScope.lng=0;
      $rootScope.contextpath = '/yewmedsubadmin';
      
      if(localStorage.getItem("loggedinuserdetails") != null ){
          var userdata=JSON.parse(localStorage.getItem("loggedinuserdetails"));
         $rootScope.activeusername=userdata.name;
         }
         else{
           $rootScope.activeusername='User'; 
         }


});
applog.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

