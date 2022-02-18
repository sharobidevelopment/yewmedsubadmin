/**
 * 
 */

'use strict';
angular.module('myApp').factory('OrderHistoryService', ['$http', '$q','$cookies', function($http, $q,$cookies){

    var REST_GET_ORDERS_URI = serverurl+'/orders/forstore';
    var REST_GET_FILTERED_ORDERS_URI = serverurl+'/orders/forstore?page=';
    var REST_SUBURI1 ='&limit=';
    var REST_SUBURI2='&startDate=';
    var REST_SUBURI3='&endDate=';
    var REST_SALE_DISPATCH_URI=serverurl+'/orders/dispatch';
    var REST_SUBURI4='&itemId=';
    var REST_SUBURI5='&status=';

    var limit=20;
    var factory = {
    	getOrdersByStore: getOrdersByStore,
        getFilteredOrderList:getFilteredOrderList,
        getOrdersByPeginition:getOrdersByPeginition,
        itemDispatch:itemDispatch
        
    };
    return factory;

    

    function getOrdersByStore() {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
        $http.get(REST_GET_FILTERED_ORDERS_URI+1+REST_SUBURI1+limit+REST_SUBURI5+2,{        
                    headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                
                deferred.resolve(response);
            },
            function(errResponse){
                console.error('Error while orders  fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    

   function getFilteredOrderList(todate,formdate,itemid) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
        $http.get(REST_GET_FILTERED_ORDERS_URI+1+REST_SUBURI1+limit+REST_SUBURI2+todate+REST_SUBURI3+formdate+REST_SUBURI4+itemid+REST_SUBURI5+2,{        
                    headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                
                deferred.resolve(response);
            },
            function(errResponse){
                console.error('Error while orders  fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
function getOrdersByPeginition(todate,formdate,pageno,itemid){
     var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
        $http.get(REST_GET_FILTERED_ORDERS_URI+pageno+REST_SUBURI1+limit+REST_SUBURI2+todate+REST_SUBURI3+formdate+REST_SUBURI4+itemid+REST_SUBURI5+2,{        
                    headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                
                deferred.resolve(response);
            },
            function(errResponse){
                console.error('Error while orders  fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
}



function itemDispatch(orderDetails) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();

        $http.post(REST_SALE_DISPATCH_URI,orderDetails,{        
                    headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                $.alert.open(response.data.message);
                deferred.resolve(response);
            },
            function(errResponse){
                $.alert.open(errResponse.data.message);
                console.error('Error while orders  fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }



}]);
