/**
 * 
 */

'use strict';
angular.module('myApp').factory('OrdertakingService', ['$http', '$q','$cookies', function($http, $q,$cookies){

    var REST_GET_ORDERS_URI = serverurl+'/orders/forstore';
    var REST_GET_ORDERS_PEGINITION_URI = serverurl+'/orders/forstore?page=';
    var REST_GET_ORDERS_PEGINITION_SUB_URI ='&limit=';
    var REST_SALE_ITEM_URI=serverurl+'/orders/sale';
    var REST_ACCEPT_ITEM_URI=serverurl+'/orders/accept';
    var REST_ACCEPT_ITEM_URI_DUP=serverurl+'/orders/assignOrderItemStore';
    var REST_ACCEPT_ITEMS_URI = serverurl+'/orders/acceptAllOrder';
    var REST_FETCH_PRESCRIPTION_URI=serverurl+'/prescriptions/download/';
    var REST_SUB_URI1='/foradmin';

    var REST_SALE_ORDER_URI='';
    var REST_ACCEPT_ORDER_URI='';
    var limit=20;
    var factory = {
    	getOrdersByStore: getOrdersByStore,
        itemSale:itemSale,
        itemAccept:itemAccept,
        itemAcceptAll:itemAcceptAll,
        acceptOrder:acceptOrder,
        orderSale:orderSale,
        getOrdersByPeginition:getOrdersByPeginition,
        fetchFile:fetchFile
    };
    return factory;

    

    function getOrdersByStore() {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
        $http.get(REST_GET_ORDERS_URI,{        
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
    
function getOrdersByPeginition(pageno){
     var tokenCookie = $cookies.get('storeToken');
     console.log(tokenCookie);
        var deferred = $q.defer();
        $http.get(REST_GET_ORDERS_PEGINITION_URI+pageno+REST_GET_ORDERS_PEGINITION_SUB_URI+limit,{        
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



function acceptOrder(order) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
         
         $http.post(REST_ACCEPT_ORDER_URI,order,{        
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

function orderSale(order) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
         
         $http.post(REST_SALE_ORDER_URI,order,{        
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











 function itemAccept(orderDetails) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
         
         $http.post(REST_ACCEPT_ITEM_URI_DUP,orderDetails,{        
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



    function itemAcceptAll(orderDetails) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
         
         $http.post(REST_ACCEPT_ITEMS_URI,orderDetails,{        
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






     function itemSale(orderDetails) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();

        $http.post(REST_SALE_ITEM_URI,orderDetails,{        
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


 /*function itemSale(orderDetails) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();

        $http.post(REST_SALE_ITEM_URI,orderDetails,{        
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
    }*/



  function fetchFile(pid){
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();

        $http.get(REST_FETCH_PRESCRIPTION_URI+pid+REST_SUB_URI1,{        
                    headers:{'Authorization': tokenCookie},responseType: 'arraybuffer'
                  })
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
              console.error('Error while orders  fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;


  }




}]);
