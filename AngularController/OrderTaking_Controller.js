'use strict';

angular.module('myApp').controller('OrderTakingController', ['$scope', '$http' , '$cookies', '$location',  '$route', '$rootScope','OrdertakingService', '$timeout' , '$interval' , function($scope, $http , $cookies, $location, $route, $rootScope,OrdertakingService,$timeout,$interval) {
    var self = this;
    $scope.orders=[];
    $scope.orders1=[];
    $scope.orders2=[];
    $scope.order={};
     var pageno=2;
     $scope.coma = ',';
     $scope.limit = 10;
     localStorage.setItem("page_link_no", 2);
     $scope.navigators = {prev:{state:true}, next:{state:true}};
      $scope.curPage = 1,
      $scope.itemsPerPage = 3,
      $scope.maxSize = 5;
      $scope.interval_count = 0;
      $scope.time=Date.parse(new Date());
      $scope.total_pending_order_1 = 0;
      $scope.time_interval = 5; // Time reservation before subadmin can respond. After that control task part to admin
       
       // function playAudio() {
       //   var x1 = document.getElementById("myAudio").autoplay; 
       //  } 
      

     $scope.storeStatusCookie = $cookies.get('StoreStatus');
       if ($scope.storeStatusCookie === undefined) {
           $location.path($rootScope.contextpath + "/");
           $scope.storeStatusCookie = 'Deactive';
       }
       else if ($scope.storeStatusCookie === 'Deactive') {
           $location.path($rootScope.contextpath + "/");
       }
       
      getOrderDetailsByStore();


      $interval(function() {
        if(localStorage.getItem("page_link_no")==2){
          getLastOneHourOrders();
          $scope.interval_count++;
        }
      }, 50000)




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
                        alertify.success($scope.total_pending_order+ " order pending to accept ");
                        document.getElementById("myAudio").play();
                        if($scope.total_pending_order != $scope.total_pending_order_1){
                           getOrderDetailsByStore();
                         }
                        $scope.total_pending_order_1 = $scope.total_pending_order;
                  }
              },
              function(errResponse) {
                  console.error("errResponse:" + 'Error while fetching All Contacts details');
            })
          }
      }



       //alert('Example of a basic alert box in jquery', 'jquery basic alert box');




      function getOrderDetailsByStore(){
         OrdertakingService.getOrdersByStore()
            .then(
                function successCallback(response) {
                    console.log("orders: "+JSON.stringify(response.data));
                     $scope.orders=response.data;

                     // for(var i=0;i<=$scope.orders1.length; i++){
                     //      alert("Hi");
                     //      if(i!=$scope.orders1.length){
                     //      var customer_add_id = $scope.orders1[i].customerAddressId;
                     //       $scope.order = $scope.orders1[i];
                     //        console.log("orders1[i]: "+$scope.order);
                     //        $http.get(serverurl+"/addresses/" + customer_add_id)         
                     //       .then(
                     //          function(response) {
                     //             alert("response");
                     //                $scope.order.streetAddress = response.data;
                     //                $scope.orders2.push($scope.order);                                   
                     //          },
                     //          function(errResponse) {}
                     //      );
                     //     }
                     //     else{
                     //          alert("Hello");
                     //          $scope.orders = $scope.orders2;
                     //     }
                          
                     // }
                     // alertify.success(response.data.length + " order pending to accept");

                      if($scope.orders.length == 20) {
                           $scope.nextData();
                      }

                      // ........................pagination part start.....................

                      else{
                         $scope.count = 0;
                     for(var t=0;t<$scope.orders.length;t++){
                          $scope.orders[t].dateparse=Date.parse($scope.orders[t].createdDate);
                          if($scope.time-Date.parse($scope.orders[t].createdDate) <=$scope.time_interval){
                              $scope.count++;
                          }
                      }
                      //alert($scope.count);
                      if($scope.count>0 && $scope.interval_count >=1){
                           // alertify.success($scope.count + " order pending to accept");
                           // document.getElementById("myAudio").autoplay;
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

                      // ........................pagination part start end.....................

                },
                function error(response) {
                    
                }

            );
      }

 $scope.nextData = function() {
    OrdertakingService.getOrdersByPeginition(pageno)
            .then(
                function successCallback(response) {
                    console.log(response.data);
                    pageno= Number(pageno) + 1;
                     Array.prototype.push.apply($scope.orders,response.data); 
                     if(response.data.length == 20){
                          $scope.nextData();
                     } 

                     // ........................pagination part start.....................

                     else{
                         $scope.count = 0;
                     for(var t=0;t<$scope.orders.length;t++){
                          $scope.orders[t].dateparse=Date.parse($scope.orders[t].createdDate);
                          if(($scope.time-Date.parse($scope.orders[t].createdDate))/3600000 <=$scope.time_interval){
                              $scope.count++;
                          }
                      }
                      if($scope.count>0 && $scope.interval_count >=1){
                           // alertify.success($scope.count + " order pending to accept");
                           // document.getElementById("myAudio").play();
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
                        pageno = 2; 
                    }

                    // ........................pagination part start end.....................


                },
                function error(response) { 
                }
            );
 }



  $scope.orderAccept = function(order) {
            OrdertakingService.acceptOrder(order)
                    .then(
                        function successCallback(response) {
                          if(response.status==200){
                                 order.orderStatus=1;
                                 for( var j=0;j<order.orderDetails.length;j++){
                                       order.orderDetails[j].status=1;
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
 $scope.saleOrder = function(order) {
            OrdertakingService.orderSale(order)
                    .then(
                        function successCallback(response) {
                          if(response.status==200){
                                 order.orderStatus=2;
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


 $scope.itemAccept = function(order,orderdetailsid) {
       var orderDetails={};
       orderDetails.id=orderdetailsid;
       orderDetails.deliveryType = document.querySelector('input[name = deliveryType_'+orderdetailsid+']:checked').value;
       orderDetails.companyId = 0;
       orderDetails.storeId = 0;
       // orderDetails.storeName = $rootScope.activeusername;
          OrdertakingService.itemAccept(orderDetails)
                    .then(
                        function successCallback(response) {
                          if(response.status==200){
                                 for( var j=0;j<order.orderDetails.length;j++){
                                       if(order.orderDetails[j].id==orderdetailsid){
                                          order.orderDetails[j].status=1;
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



    $scope.deliveryTypeChoose = function(id){
      $("#storeAssign_"+id).prop('disabled', false);
    }


   
    $scope.itemAcceptAll = function(order){
         $scope.orderlist = [];
         console.log(JSON.stringify(order));
         for(var k=0; k<order.orderDetails.length; k++){
             // if ($scope.orderlist == "") {
                    $scope.orderlist.push(order.orderDetails[k]);
                // } else {
                    //     $scope.orderlist = $scope.orderlist + $scope.coma + order.orderDetails[k].id;
                    // }
         }
         console.log(JSON.stringify($scope.orderlist));
         OrdertakingService.itemAcceptAll($scope.orderlist)
                    .then(
                        function successCallback(response) {
                          if(response.status==200){
                                 for( var j=0;j<order.orderDetails.length;j++){
                                       // if(order.orderDetails[j].id==orderdetailsid){
                                          order.orderDetails[j].status=1;
                                          // break;
                                         // } 
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


   
    $scope.saleItem = function(order,orderdetailsid) {
      var orderDetails={};
       orderDetails.id=orderdetailsid;
       OrdertakingService.itemSale(orderDetails)
                    .then(
                        function successCallback(response) {
                          if(response.status==200){
                                for(var j=0;j<order.orderDetails.length;j++){
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
    if( order.orderDetails[i].status == 0){
          return true;  
        }     
    }
    return false;        
 }

$scope.downloadPrescription= function(order) {
var numberofprescription = order.prescriptions.length;
  for(var i=0;i<numberofprescription;i++){
    var filename=order.prescriptions[i].userFilename;
    var fileid=order.prescriptions[i].id;
     download(filename,fileid);
         }
       }

function download(filename,fileid){
   OrdertakingService.fetchFile(fileid)
                    .then(
                        function successCallback(response) {
                            var linkElement = document.createElement('a');
                              try {
                                    var blob = new Blob([response], {
                                    type: 'application/octet-stream' 
                                    });
                                    var url = window.URL.createObjectURL(blob);
                                    linkElement.setAttribute('href', url);
                                    linkElement.setAttribute("download", filename);
                                    var clickEvent = new MouseEvent("click", {
                                       "view": window,
                                       "bubbles": true,
                                       "cancelable": false
                                       });
                                    linkElement.dispatchEvent(clickEvent);
                                   } catch (ex) {
                                        console.log(ex);
                                   }
                           
                            },
                        function error(response) {
                          console.log("Error Occoured");
                        }
                    );
}



}]);