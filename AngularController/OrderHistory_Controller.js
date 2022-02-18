'use strict';

angular.module('myApp').controller('OrderHistoryController', ['$scope', '$http','$cookies', '$location',  '$route', '$rootScope','OrderHistoryService', 'OrdertakingService' , '$interval' , function($scope,$http, $cookies, $location, $route, $rootScope,OrderHistoryService,OrdertakingService,$interval) {
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



    //    $interval(function() {
    //    if(localStorage.getItem("page_link_no")==4){ 
    //    // getOrderDetailsByStore1();
    //    getLastOneHourOrders();
    //    $scope.interval_count++;
    //  }
    // }, 50000) 
  

       
      getOrderDetailsByStore();

      function getOrderDetailsByStore(){
         OrderHistoryService.getOrdersByStore()
            .then(
                function successCallback(response) {
                    console.log(JSON.stringify(response.data));
                     $scope.orders=response.data;
                     if($scope.orders.length == 20){
                         $scope.nextData();
                     }
                      // ....................Pagination Part......................

                     else{
                      for(var k=0;k<$scope.orders.length;k++){
                           var sum=0;
                           for(var l=0;l<$scope.orders[k].orderDetails.length;l++){
                               if($scope.orders[k].orderDetails[l].status == 2){
                                      sum = Math.round(sum+$scope.orders[k].orderDetails[l].netAmount);
                               }
                           }
                           $scope.orders[k].totalSum = sum;
                      }
                      // alertify.success($scope.orders.length + " order pending to accept");
                      if($scope.orders.length != 0) { 
                      $scope.paginate = function(){ 
                        $scope.pages = [];//clear it here resetting
                        var n = Math.ceil($scope.orders.length / $scope.limit);
                        for(var i=0; i<n; i++)
                          $scope.pages.push({start:(i*$scope.limit), page:i+1, active:false});
                        $scope.setPageActive(1); 
                      }
                      $scope.setPageActive = function(page){
                        var index = page-1;
                        $scope.index_no = page-1;
                        var n =   $scope.pages.length;
                        var previous_page = 1;
                        for(var i=0; i<n; i++){
                          if($scope.pages[i].active)
                            var current_page = $scope.pages[i].page;
                        
                          if(i==index)
                            $scope.pages[i].active = true;
                          else
                          $scope.pages[i].active= false;
                        } 
                       var limit = $scope.pages[index].start+$scope.limit;
                      $scope.copy_items = angular.copy($scope.orders); 
                      $scope.copy_items = $scope.copy_items.splice($scope.pages[index].start, limit+1);
                      $scope.navigators["next"].state =  index < (n-1) ? true:false;
                      $scope.navigators["prev"].state =  index > 0 ? true:false;
                      }
                      $scope.prev = function(){ 
                        if($scope.navigators.prev.state){
                           $scope.setPageActive($scope.getCurrentPage()-1);
                        }
                      }
                      $scope.next = function(){
                        if($scope.navigators.next.state){
                           $scope.setPageActive($scope.getCurrentPage()+1);
                        }
                      }
                      $scope.getCurrentPage = function (){
                         for(var i=0;i<$scope.pages.length; i++)
                          if($scope.pages[i].active)
                            return i+1;
                      }
                          $scope.paginate();
                     }
                     else {
                        console.log("No Data Found");
                        }  
                     }

                     // ....................Pagination Part End......................
                },
                function error(response) {
                    
                }

            );
      }



      function getOrderDetailsByStore1(){
         OrdertakingService.getOrdersByStore()
            .then(
                function successCallback(response) {
                    console.log("orders: "+JSON.stringify(response.data));
                     $scope.orders_1=response.data;
                      if($scope.orders_1.length == 20) {
                           $scope.nextData1();
                      }

                      // ........................pagination part start.....................

                      else{
                         $scope.count = 0;
                     for(var t=0;t<$scope.orders_1.length;t++){
                          $scope.orders_1[t].dateparse=Date.parse($scope.orders_1[t].createdDate);
                          if($scope.time-Date.parse($scope.orders_1[t].createdDate)/3600000 <=$scope.time_interval){
                              $scope.count++;
                          }
                      }
                      alert($scope.count);
                      if($scope.count>0 && $scope.interval_count>=1){
                           alertify.success("<a href='/yewmedsubadmin/orders' style='color:white'>"+$scope.count + " order pending to accept </a>");
                           document.getElementById("myAudio").play();
                      }   
                    }
                  }
                  );
                }



     $scope.nextData1 = function() {
    OrdertakingService.getOrdersByPeginition(pageno1)
            .then(
                function successCallback(response) {
                    console.log(response.data);
                    pageno1= Number(pageno1) + 1;
                     Array.prototype.push.apply($scope.orders_1,response.data); 
                     if(response.data.length == 20){
                          $scope.nextData1();
                     } 

                     // ........................pagination part start.....................

                     else{
                         $scope.count = 0;
                     for(var t=0;t<$scope.orders_1.length;t++){
                          $scope.orders_1[t].dateparse=Date.parse($scope.orders_1[t].createdDate);
                          if(($scope.time-Date.parse($scope.orders_1[t].createdDate))/3600000 <=$scope.time_interval){
                              $scope.count++;
                          }
                      }
                      if($scope.count>0 && $scope.interval_count>=1){
                           alertify.success("<a href='/yewmedsubadmin/orders' style='color:white'>"+$scope.count + " order pending to accept </a>");
                           document.getElementById("myAudio").play();
                      } 
                           pageno1 = 2;
                      }
                    });
                      }  




 
 $scope.fetchItems= function(){
                
      var searchText_len = $scope.searchText.trim().length;

      // Check search text length
      if(searchText_len >= 3){
         $http({
           method: 'get',
           url: serverurl+'/items/searchbasic?name='+$scope.searchText,
           /*data: {searchText:$scope.searchText}*/
         }).then(function successCallback(response) {
            if(response.data.length>0){
                $scope.searchResult = response.data;
               $('#searchData').show();
              }
           });
      }else{
         $scope.searchResult = {};
         $scope.itemid=0;
      }
                
   }

   // Set value to search box
   $scope.setValue = function(index,$event){
    $('#searchData').hide();
      $scope.itemid=$scope.searchResult[index].id;
      $scope.searchText = $scope.searchResult[index].name;
      $scope.searchResult = {};
      $event.stopPropagation();
   }

   $scope.searchboxClicked = function($event){
      $event.stopPropagation();
   }

   $scope.containerClicked = function(){
      $scope.searchResult = {};
   }



   $scope.getSearchResult= function(){
    
     if($scope.formdate == '' || $scope.formdate == undefined){
       $scope.formdate = moment(new Date()).format("YYYY-MM-DD");
     }

      if($scope.todate == '' || $scope.todate == undefined){
        $scope.todate = moment(new Date()).format("YYYY-MM-DD");
     }

     if($scope.formdate>$scope.todate){
         $.alert.open("Enter Correct Date Range");
     }else{
      
         filterSerachResult($scope.formdate,$scope.todate); 
        }
   }

 function filterSerachResult(todate,formdate){
        OrderHistoryService.getFilteredOrderList(todate,formdate,$scope.itemid)
            .then(
                function successCallback(response) {
                    console.log(JSON.stringify(response.data));
                     $scope.orders=response.data;
                     $scope.search=$scope.itemid;
                     if($scope.orders.length == 20){
                         $scope.nextData();
                     }
                      // ....................Pagination Part......................

                     else{
                        for(var k=0;k<$scope.orders.length;k++){
                             var sum=0;
                             for(var l=0;l<$scope.orders[k].orderDetails.length;l++){
                                 if($scope.orders[k].orderDetails[l].status == 2){
                                        sum = Math.round(sum+$scope.orders[k].orderDetails[l].netAmount);
                                 }
                             }
                             $scope.orders[k].totalSum = sum;
                        }
                      // alertify.success($scope.orders.length + " order pending to accept");
                      if($scope.orders.length != 0) { 
                      $scope.paginate = function(){ 
                        $scope.pages = [];//clear it here resetting
                        var n = Math.ceil($scope.orders.length / $scope.limit);
                        for(var i=0; i<n; i++)
                          $scope.pages.push({start:(i*$scope.limit), page:i+1, active:false});
                        $scope.setPageActive(1); 
                      }
                      $scope.setPageActive = function(page){
                        var index = page-1;
                        $scope.index_no = page-1;
                        var n =   $scope.pages.length;
                        var previous_page = 1;
                        for(var i=0; i<n; i++){
                          if($scope.pages[i].active)
                            var current_page = $scope.pages[i].page;
                        
                          if(i==index)
                            $scope.pages[i].active = true;
                          else
                          $scope.pages[i].active= false;
                        } 
                       var limit = $scope.pages[index].start+$scope.limit;
                      $scope.copy_items = angular.copy($scope.orders); 
                      $scope.copy_items = $scope.copy_items.splice($scope.pages[index].start, limit+1);
                      $scope.navigators["next"].state =  index < (n-1) ? true:false;
                      $scope.navigators["prev"].state =  index > 0 ? true:false;
                      }
                      $scope.prev = function(){ 
                        if($scope.navigators.prev.state){
                           $scope.setPageActive($scope.getCurrentPage()-1);
                        }
                      }
                      $scope.next = function(){
                        if($scope.navigators.next.state){
                           $scope.setPageActive($scope.getCurrentPage()+1);
                        }
                      }
                      $scope.getCurrentPage = function (){
                         for(var i=0;i<$scope.pages.length; i++)
                          if($scope.pages[i].active)
                            return i+1;
                      }
                          $scope.paginate();
                     }
                     else {
                        console.log("No Data Found");
                        }  
                     }

                     // ....................Pagination Part End......................

                },
                function error(response) {
                    
                }

            );
     }


$scope.nextData = function() {
  if($scope.formdate == '' || $scope.formdate == undefined){
       $scope.formdate = moment(new Date()).format("YYYY-MM-DD");
     }

      if($scope.todate == '' || $scope.todate == undefined){
        $scope.todate = moment(new Date()).format("YYYY-MM-DD");
     }
    OrderHistoryService.getOrdersByPeginition($scope.formdate,$scope.todate,page,$scope.itemid)
            .then(
                function successCallback(response) {
                    console.log(response.data);
                    page= Number(page) + 1;
                    Array.prototype.push.apply($scope.orders,response.data); 

                    if(response.data.length == 20){
                        $scope.nextData();
                    }

                     // ....................Pagination Part......................

                     else{
                      // alertify.success($scope.orders.length + " order pending to accept");
                      if($scope.orders.length != 0) { 
                      $scope.paginate = function(){ 
                        $scope.pages = [];//clear it here resetting
                        var n = Math.ceil($scope.orders.length / $scope.limit);
                        for(var i=0; i<n; i++)
                          $scope.pages.push({start:(i*$scope.limit), page:i+1, active:false});
                        $scope.setPageActive(1); 
                      }
                      $scope.setPageActive = function(page){
                        var index = page-1;
                        $scope.index_no = page-1;
                        var n =   $scope.pages.length;
                        var previous_page = 1;
                        for(var i=0; i<n; i++){
                          if($scope.pages[i].active)
                            var current_page = $scope.pages[i].page;
                        
                          if(i==index)
                            $scope.pages[i].active = true;
                          else
                          $scope.pages[i].active= false;
                        } 
                       var limit = $scope.pages[index].start+$scope.limit;
                      $scope.copy_items = angular.copy($scope.orders); 
                      $scope.copy_items = $scope.copy_items.splice($scope.pages[index].start, limit+1);
                      $scope.navigators["next"].state =  index < (n-1) ? true:false;
                      $scope.navigators["prev"].state =  index > 0 ? true:false;
                      }
                      $scope.prev = function(){ 
                        if($scope.navigators.prev.state){
                           $scope.setPageActive($scope.getCurrentPage()-1);
                        }
                      }
                      $scope.next = function(){
                        if($scope.navigators.next.state){
                           $scope.setPageActive($scope.getCurrentPage()+1);
                        }
                      }
                      $scope.getCurrentPage = function (){
                         for(var i=0;i<$scope.pages.length; i++)
                          if($scope.pages[i].active)
                            return i+1;
                      }
                          $scope.paginate();
                     }
                     else {
                        console.log("No Data Found");
                        }  
                     }

                     // ....................Pagination Part End......................
                     
                },
                function error(response) {
                    
                }

            );

 }


    var tokenCookie = $cookies.get('storeToken');
    function getLastOneHourOrders(){

         if($scope.interval_count>=1){
         $http.get(serverurl + "/orders/getLastOneHourOrders", {
            headers: {
                'Authorization': tokenCookie
            }
        })
        .then(
            function(response) {
                $scope.total_pending_order = response.data;
                if($scope.total_pending_order>0){
                      alertify.success("<a href='/yewmedsubadmin/orders' style='color:white'>"+$scope.total_pending_order+ " order pending to accept </a>");
                      document.getElementById("myAudio").play();
                }
            },
            function(errResponse) {
                console.error("errResponse:" + 'Error while fetching All Contacts details');
          })
        }
      }





     $scope.dispatchItem = function(order,orderdetailsid) {
      var orderDetails={};
      orderDetails.id=orderdetailsid;
      console.log(orderDetails);
       OrderHistoryService.itemDispatch(orderDetails)
                    .then(
                        function successCallback(response) {
                          if(response.status==200){

                                for( var j=0;j<order.orderDetails.length;j++){
                                       if(order.orderDetails[j].id==orderdetailsid){
                                          order.orderDetails[j].status=3;
                                          break;
                                         }
                                       }
                                
                                 for(var i=0;i<$scope.orders.length;i++){
                                       if($scope.orders[i].id==order.id){
                                          $scope.orders[i]=order;
                                       }
                                    }

                           }
                            else{
                               
                             }
                           
                            },
                        function error(response) {
                          console.log("Error Occoured");
                        }
                    );
  }





}]);