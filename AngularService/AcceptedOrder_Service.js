/**
 * 
 */

'use strict';
angular.module('myApp').factory('AcceptedOrderService', ['$http', '$q','$cookies', function($http, $q,$cookies){

    var REST_GET_ORDERS_URI = serverurl+'/orders/forstore';
    var REST_GET_ORDERS_PEGINITION_URI = serverurl+'/orders/forstore?page=';
    var REST_GET_ORDERS_PEGINITION_SUB_URI ='&limit=';
    var REST_SALE_ITEM_URI=serverurl+'/orders/sale';
    var REST_SALE_ITEMS_URI=serverurl+'/orders/saleAllOrder';
    var REST_ACCEPT_ITEM_URI=serverurl+'/orders/accept';
    var REST_SUBURI1 ='&limit=';
    var REST_SUBURI2='&startDate=';
    var REST_SUBURI3='&endDate=';
    var REST_SUBURI4='&itemId=';
    var REST_SUBURI5='&status=';
    var limit=20;
    var factory = {
    	getOrdersByStore: getOrdersByStore,
        itemSale:itemSale,
        itemSaleAll:itemSaleAll,
        getOrdersByPeginition:getOrdersByPeginition,
        getFilteredOrderList:getFilteredOrderList
    };
    return factory;

    

    function getOrdersByStore() {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
        $http.get(REST_GET_ORDERS_PEGINITION_URI+1+REST_SUBURI5+1,{        
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
    
function getOrdersByPeginition(pageno,todate,formdate,itemid){
     var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
        //$http.get(REST_GET_ORDERS_PEGINITION_URI+pageno+REST_GET_ORDERS_PEGINITION_SUB_URI+limit+REST_SUBURI5+1,{        
        $http.get(REST_GET_ORDERS_PEGINITION_URI+pageno+REST_SUBURI1+limit+REST_SUBURI2+todate+REST_SUBURI3+formdate+REST_SUBURI4+itemid+REST_SUBURI5+1,{        
        

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

 function itemSale(orderDetails) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();

        $http.post(REST_SALE_ITEM_URI,orderDetails,{        
                    headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                //$.alert.open(response.data.message);
                deferred.resolve(response);
            },
            function(errResponse){
                //$.alert.open(errResponse.data.message);
                console.error('Error while orders  fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    
    function itemSaleAll(orderDetails) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();

        $http.post(REST_SALE_ITEMS_URI,orderDetails,{        
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



function getFilteredOrderList(todate,formdate,itemid) {
        var tokenCookie = $cookies.get('storeToken');
        var deferred = $q.defer();
        $http.get(REST_GET_ORDERS_PEGINITION_URI+1+REST_SUBURI1+limit+REST_SUBURI2+todate+REST_SUBURI3+formdate+REST_SUBURI4+itemid+REST_SUBURI5+1,{        
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
    








}]);
