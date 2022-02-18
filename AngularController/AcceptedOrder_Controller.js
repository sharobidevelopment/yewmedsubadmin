'use strict';

angular.module('myApp').controller('AcceptedOrderController', ['$scope', '$cookies', '$location',  '$route', '$rootScope','$http','AcceptedOrderService', 'OrdertakingService' , '$interval' , function($scope, $cookies, $location, $route, $rootScope,$http,AcceptedOrderService,OrdertakingService,$interval) {
    var self = this;
    //alert("Hiii");
    $scope.orders=[];
     var pageno=2;
     var pageno1=2;
     $scope.itemid=0;
     $scope.search=0;
     $scope.limit = 10;
     $scope.navigators = {prev:{state:true}, next:{state:true}};
     localStorage.setItem("page_link_no", 3);
     $scope.interval_count = 0;

     $scope.storeStatusCookie = $cookies.get('StoreStatus');
       if ($scope.storeStatusCookie === undefined) {
           $location.path($rootScope.contextpath + "/");
           $scope.storeStatusCookie = 'Deactive';
       }
       else if ($scope.storeStatusCookie === 'Deactive') {
           $location.path($rootScope.contextpath + "/");
       }

       var tokenCookie = $cookies.get('storeToken');


    //    $interval(function() {
    //    if(localStorage.getItem("page_link_no")==3){ 
    //    // getOrderDetailsByStore1();
    //    getLastOneHourOrders();
    //    $scope.interval_count++;
    //    }
    // }, 50000)

      $scope.pickedtimeArray = [
         {"value":"9:00", "valshow":"9:00 AM"},
         {"value":"9:30", "valshow":"9:30 AM"},
         {"value":"10:00", "valshow":"10:00 AM"},
         {"value":"10:30", "valshow":"10:30 AM"},
         {"value":"11:00", "valshow":"11:00 AM"},
         {"value":"11:30", "valshow":"11:30 AM"},
         {"value":"12:00", "valshow":"12:00 AM"},
         {"value":"12:30", "valshow":"12:30 PM"},
         {"value":"13:00", "valshow":"01:00 PM"},
         {"value":"13:30", "valshow":"01:30 PM"},
         {"value":"14:00", "valshow":"02:00 PM"},
         {"value":"14:30", "valshow":"02:30 PM"},
         {"value":"15:00", "valshow":"03:00 PM"},
         {"value":"15:30", "valshow":"03:30 PM"},
         {"value":"16:00", "valshow":"04:00 PM"},
         {"value":"16:30", "valshow":"04:30 PM"},
         {"value":"17:00", "valshow":"05:00 PM"},
         {"value":"17:30", "valshow":"05:30 PM"},
         {"value":"18:00", "valshow":"06:00 PM"},
         {"value":"18:30", "valshow":"06:30 PM"},
         {"value":"19:00", "valshow":"07:00 PM"},
         {"value":"19:30", "valshow":"07:30 PM"},
         {"value":"20:00", "valshow":"08:00 PM"},
         {"value":"20:30", "valshow":"08:30 PM"},
         {"value":"21:00", "valshow":"09:00 PM"}
      ];

      $scope.pickedDateArray = [
         {"value":"1", "valshow":"Today"},
         {"value":"2", "valshow":"Tomorrow"},
         {"value":"3", "valshow":"Day After Tomorrow"}
      ]

        $interval(function() {
          getOrderDetailsByStore();
       }, 50000)

       
      getOrderDetailsByStore();

      function getOrderDetailsByStore(){
         AcceptedOrderService.getOrdersByStore()
            .then(
                function successCallback(response) {
                    console.log(response.data);
                     $scope.orders=response.data;

                     if($scope.orders.length == 20){
                         $scope.nextData();
                     }

                     // ....................Pagination Part......................

                     else{
                      if($scope.orders.length != 0) { 
                      alertify.success($scope.orders.length+ " order pending to sale </a>");
                      document.getElementById("myAudio").play();
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
                           document.getElementById("myAudio").autoplay;
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
        AcceptedOrderService.getFilteredOrderList(todate,formdate,$scope.itemid)
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

     if($scope.formdate>$scope.todate){
       $.alert.open("Enter Correct Date Range");
     }else{
          AcceptedOrderService.getOrdersByPeginition(pageno,$scope.formdate,$scope.todate,$scope.itemid)
            .then(
                function successCallback(response) {
                    console.log(response.data);
                    pageno= Number(pageno) + 1;
                     Array.prototype.push.apply($scope.orders,response.data); 

                     if(response.data.length == 20){
                          $scope.nextData();
                     }

                     // ....................Pagination Part......................

                     else{
                      // alertify.success($scope.orders.length + " order pending to accept");
                      if($scope.orders.length != 0) { 
                        alertify.success($scope.orders.length+ " order pending to sale </a>");
                      document.getElementById("myAudio").play();
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
      }

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


      $scope.checkBatch = function(order,orderdetailsId,orderDetails){
        console.log(orderDetails.deliveryType);
            var singleBatch = $("#batch_"+orderdetailsId).val();
            var singleExpiery = $("#expiery_"+orderdetailsId).val();
            var singleDeliveryperson = $("#deliveryperson_"+orderdetailsId).val();
            var singleDeliverydate = $("#deliverydate_"+orderdetailsId).val();
            var singleDeliverytime = $("#deliverytime_"+orderdetailsId).val();
            if(orderDetails.deliveryType == "YMM Delivery"){
            //alert("hiiii"); 
            if(singleExpiery !=""){
                if(singleExpiery.length<6){
                   $("#saleitmbtn_"+orderdetailsId).prop('disabled', true);
                }
                else{
                  if(singleExpiery.length==6){
                   var datesplit = singleExpiery.split('');
                   console.log(datesplit);
                   $("#expiery_"+orderdetailsId).val(datesplit[0]+datesplit[1]+'/'+datesplit[2]+datesplit[3]+datesplit[4]+datesplit[5]); 
                  }
                  if(singleBatch !="" && singleDeliverydate && singleDeliverytime){

                    $("#saleitmbtn_"+orderdetailsId).prop('disabled', false);
                  }
                  else{
                      $("#saleitmbtn_"+orderdetailsId).prop('disabled', true);
                  }
                }
            }
            else if(singleBatch !="" && singleExpiery !="" && singleDeliverydate && singleDeliverytime){
                $("#saleitmbtn_"+orderdetailsId).prop('disabled', false);
            }
            else{
                $("#saleitmbtn_"+orderdetailsId).prop('disabled', true);
            }
          }


          else{
              if(singleExpiery !=""){
                if(singleExpiery.length<6){
                   $("#saleitmbtn_"+orderdetailsId).prop('disabled', true);
                }
                else{
                  if(singleExpiery.length==6){
                   var datesplit = singleExpiery.split('');
                   console.log(datesplit);
                   $("#expiery_"+orderdetailsId).val(datesplit[0]+datesplit[1]+'/'+datesplit[2]+datesplit[3]+datesplit[4]+datesplit[5]); 
                  }
                  if(singleBatch !="" && singleDeliveryperson){

                    $("#saleitmbtn_"+orderdetailsId).prop('disabled', false);
                  }
                  else{
                      $("#saleitmbtn_"+orderdetailsId).prop('disabled', true);
                  }
                }
            }
            else if(singleBatch !="" && singleExpiery !="" && singleDeliveryperson){
                $("#saleitmbtn_"+orderdetailsId).prop('disabled', false);
            }
            else{
                $("#saleitmbtn_"+orderdetailsId).prop('disabled', true);
            }
          }
      }

 
 
    $scope.saleItem = function(order,orderdetailsid, orderdetails) {
      var perticularOrderDetails = orderdetails;
      var batch = $("#batch_"+orderdetailsid).val();
      var orderDetails={};
      orderDetails.id=orderdetailsid;
      orderDetails.batchNo = batch;
      orderDetails.expiryDate = $("#expiery_"+orderdetailsid).val();
      if(perticularOrderDetails.deliveryType == "YMM Delivery"){
        var deliverydate = $("#deliverydate_"+orderdetailsid).val();
        var deliverytime = $("#deliverytime_"+orderdetailsid).val();
        orderDetails.pickupDate = deliverydate;
        orderDetails.pickupTime = deliverytime;
      }
      else{
         var deliveryperson = $("#deliveryperson_"+orderdetailsid).val();
         orderDetails.deliveryAgentId = Number(deliveryperson);
         perticularOrderDetails.deliveryAgentId = Number(deliveryperson);
      }
      console.log(perticularOrderDetails)
      console.log(orderDetails);

       AcceptedOrderService.itemSale(orderDetails)
        .then(
          function successCallback(response) {
            if(response.status==200){
              for( var j=0;j<order.orderDetails.length;j++){
                if(order.orderDetails[j].id==orderdetailsid){
                  order.orderDetails[j].status=2;
                  break;
                }
              }
              for(var i=0;i<$scope.orders.length;i++){
                if($scope.orders[i].id==order.id){
                  $scope.orders[i]=order;
                }
              }
              if(perticularOrderDetails.deliveryType != "YMM Delivery"){
                $http.post(serverurl+"/delivery/assignDeliveryPerson",perticularOrderDetails,{                 
                headers:{'Authorization': tokenCookie}
                })
                .then(
                function (response1) { 
                   $.alert.open(response.data.message);
                },
                function(errResponse){
                  console.error("errResponse:"+'Error while adding users address');
                }
              );
            }
            else{
              $.alert.open(response.data.message);
            }
          }
          else{}
        },
        function error(response) {
          console.log("Error Occoured");
        }
    );
  }


  $scope.saleItemAll = function(order){
       $scope.acceptOrderlist = [];
         console.log(JSON.stringify(order));
         for(var k=0; k<order.orderDetails.length; k++){
                    $scope.acceptOrderlist.push(order.orderDetails[k]);
         }
         console.log(JSON.stringify($scope.acceptOrderlist));
         AcceptedOrderService.itemSaleAll($scope.acceptOrderlist)
                    .then(
                        function successCallback(response) {
                          if(response.status==200){
                                 for( var j=0;j<order.orderDetails.length;j++){
                                          order.orderDetails[j].status=2;
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
  

 $scope.chkShow= function(order) {
   for( var i=0;i<order.orderDetails.length;i++){
    if( order.orderDetails[i].status == 1){
          return true;  
        }     
    }
    return false;        
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



}]);