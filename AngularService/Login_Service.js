/**
 * 
 */

'use strict';
angular.module('myApp').factory('LoginService', ['$http', '$q','$cookies', function($http, $q,$cookies){

    var REST_LOGIN_SERVICE_URI = serverurl+'/users/login';
    var REST_GET_STORE_ADDRESS_SERVICE_URI=serverurl+'/stores/basicinfo';
    var factory = {
    	loginRequest: loginRequest,
        callStoreDetailsAddressData:callStoreDetailsAddressData
        
    };
    return factory;

    

    function loginRequest(user) {
        var deferred = $q.defer();
        user.loginType='SUBADMIN';
        $http.post(REST_LOGIN_SERVICE_URI, user)
            .then(
            function (response) {
            	deferred.resolve(response);
            },
            function(errResponse){
                console.error('Error while login User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function callStoreDetailsAddressData() {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
        $http.get(REST_GET_STORE_ADDRESS_SERVICE_URI,{        
                    headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                
                deferred.resolve(response);
            },
            function(errResponse){
                console.error('Error while categoriesMenu fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    

}]);
