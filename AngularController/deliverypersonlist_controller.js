'use strict';

angular.module('myApp').controller('DeliveryPersonListController', ['$scope', '$http','$cookies', '$location',  '$route', '$rootScope','DeliverOrderService', 'OrdertakingService' , '$interval' , function($scope,$http, $cookies, $location, $route, $rootScope,DeliverOrderService,OrdertakingService,$interval) {
    var self = this;

    $scope.orders=[];
    $scope.itemid=0;
    $scope.search=0;
    var page=2;
    var pageno1=2;
    $scope.limit = 10;
    $scope.interval_count = 0;
    localStorage.setItem("page_link_no", 4);
    $scope.navigators = {prev:{state:true}, next:{state:true}};
     $scope.storeStatusCookie = $cookies.get('StoreStatus');
       if ($scope.storeStatusCookie === undefined) {
           $location.path($rootScope.contextpath + "/");
           $scope.storeStatusCookie = 'Deactive';
       }
       else if ($scope.storeStatusCookie === 'Deactive') {
           $location.path($rootScope.contextpath + "/");
       }

       var tokenCookie = $cookies.get('storeToken');
       
       //$scope.deliverypersonlist = [];


      $http.get(serverurl+"/delivery/getDeliveryPersonList",{                 
      headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) { 
       	   $scope.deliverypersonlist = response.data;
       	   console.log($scope.deliverypersonlist);
       },
       function(errResponse){   
       }
       );


       $scope.activateDeliveryPerson = function(deliverypersonid){
          let delivery = {
          	"id":0,
          	"isActive":0
          }
          delivery.id = Number(deliverypersonid);
          delivery.isActive = 1;
          $http.post(serverurl+"/delivery/disableOrEnableDeliveryPerson",delivery,{                 
	      headers:{'Authorization': tokenCookie}
	          })
	       .then(
	       function (response) { 
	       	   alertify.success(response.data.message);
	       	   //$scope.deliverypersonlist = response.data;
	       	   for(var i=0;i<$scope.deliverypersonlist.length;i++){
	       	   	   if($scope.deliverypersonlist[i].id == deliverypersonid){
	       	   	   	  $scope.deliverypersonlist[i].isActive = 1;
	       	   	   }
	       	   }
	       	   console.log($scope.deliverypersonlist);
	       },
	       function(errResponse){   
	       }
	       );
       }


       $scope.deactivateDeliveryPerson = function(deliverypersonid){
          let delivery = {
          	"id":0,
          	"isActive":0
          }
          delivery.id = Number(deliverypersonid);
          delivery.isActive = 0;
          $http.post(serverurl+"/delivery/disableOrEnableDeliveryPerson",delivery,{                 
	      headers:{'Authorization': tokenCookie}
	          })
	       .then(
	       function (response) { 
	       	   alertify.success(response.data.message);
	       	   for(var i=0;i<$scope.deliverypersonlist.length;i++){
	       	   	   if($scope.deliverypersonlist[i].id == deliverypersonid){
	       	   	   	  $scope.deliverypersonlist[i].isActive = 0;
	       	   	   }
	       	   }
	       	   console.log($scope.deliverypersonlist);
	       },
	       function(errResponse){   
	       }
	       );
       }

       $scope.editdeliverperson = function(deliverypersonid){
       	  localStorage.setItem("deliverperonid", deliverypersonid);
       	  $location.path($rootScope.contextpath + "/editdeliveryperson");
       }

  


      


}]);