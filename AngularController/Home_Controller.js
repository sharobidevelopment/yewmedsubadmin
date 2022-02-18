/**
 * 
 */
'use strict';

angular.module('myApp').controller('HomeController', ['$scope', '$http' , '$cookies', '$location',  '$route', '$rootScope', 'OrdertakingService' , '$interval' , function($scope, $http, $cookies, $location, $route, $rootScope, OrdertakingService,$interval) {
    var self = this;
    $scope.time=Date.parse(new Date());
    $scope.time_interval = 1; // Time reservation before subadmin can respond. After that control task part to admin
    var pageno=2;
    $scope.interval_count = 0;
    localStorage.setItem("page_link_no", 1);
    
     $scope.storeStatusCookie = $cookies.get('StoreStatus');
       if ($scope.storeStatusCookie === undefined) {
           $location.path($rootScope.contextpath + "/");
           $scope.storeStatusCookie = 'Deactive';
       }
       else if ($scope.storeStatusCookie === 'Deactive') {
           $location.path($rootScope.contextpath + "/");
       }

    $scope.total_order_cnt = 120;
    $scope.tolCnt_purchase_amt = 1500;

    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    if(month<=9) {
    	var month1 = "0"+month;
    }
    else {
    	var month1 = month;
    }
    if(day<=9) {
        var day1 = "0"+day;
    }
    else {
        var day1 = day;
    }
    var year = d.getFullYear();

    $scope.TodayDate = year + "-" + month1 + "-" +  day1;
    $scope.TodayContacts = [];
    if(month < 4) {
        $scope.startDateYear = year-1;
    }
    else {
        $scope.startDateYear = year;
    }
       var tokenCookie = $cookies.get('storeToken');
       
     // $http.get(serverurl + "/contact/getAllContacts", {
     //        headers: {
     //            'Authorization': tokenCookie
     //        }
     //    })
     //    .then(
     //        function(response) {
     //            console.log("response:" + JSON.stringify(response.data))
     //            $scope.allContacts = response.data;
     //                      $scope.getMapResult();

     //                },
     //                function(errResponse) {
     //                    console.error("errResponse:" + 'Error while fetching All Contacts details');
     //                    $scope.getMapResult();

     //                    $({ Counter_amt: 0 }).animate({
     //                          Counter_amt: $scope.tolCnt_purchase_amt
                      
     //                  }, {
		   //                    duration: 2000,
		   //                    easing: 'swing',
		   //                    step: function() {
		   //                    $('#tolCnt_purchase_amt').text(Math.ceil(this.Counter_amt));   
     //                     }
     //                    });

     //                  $({ Counter: 0 }).animate({
     //                          Counter: $scope.total_order_cnt
                      
     //                  }, {
		   //                    duration: 2000,
		   //                    easing: 'swing',
		   //                    step: function() {
		   //                    $('#total_order_cnt').text(Math.ceil(this.Counter));   
     //                     }
     //                    });

                      

     //                });

   
    //   $interval(function() { 
    //   if(localStorage.getItem("page_link_no")==1){ 
    //    // getOrderDetailsByStore();
    //    getLastOneHourOrders();
    //    $scope.interval_count++;
    //    }
    // }, 50000)
    

    function getLastOneHourOrders(){
         if($scope.interval_count>=1){
         $http.get(serverurl + "/orders/getLastOneHourOrders", {
            headers: {
                'Authorization': tokenCookie
            }
        })
        .then(
            function(response) {
                console.log("response:" + response)
                $scope.total_pending_order = response.data;
                if($scope.total_pending_order>0){
                      alertify.success("<a href='/yewmedsubadmin/orders' style='color:white'>"+$scope.total_pending_order+ " order pending to accept </a>");
                      document.getElementById("myAudio").autoplay;
                }
            },
            function(errResponse) {
                console.error("errResponse:" + 'Error while fetching All Contacts details');
          })
        }
      }


    function getOrderDetailsByStore(){
         OrdertakingService.getOrdersByStore()
            .then(
                function successCallback(response) {
                    console.log("orders: "+JSON.stringify(response.data));
                     $scope.orders=response.data;
                      if($scope.orders.length == 20) {
                           $scope.nextData();
                      }

                      // ........................pagination part start.....................

                      else{
                         $scope.count = 0;
                     for(var t=0;t<$scope.orders.length;t++){
                          $scope.orders[t].dateparse=Date.parse($scope.orders[t].createdDate);
                          if($scope.time-Date.parse($scope.orders[t].createdDate)/3600000 <=$scope.time_interval){
                              $scope.count++;
                          }
                      }
                      // alert($scope.count);
                      if($scope.count>0 && $scope.interval_count>=1){
                           // alertify.success("<a href='/yewmedsubadmin/orders' style='color:white'>"+$scope.count + " order pending to accept </a>");
                           // document.getElementById("myAudio").autoplay;
                      }   
                    }
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
                      if($scope.count>0 && $scope.interval_count>=1){
                           alertify.success("<a href='/yewmedsubadmin/orders' style='color:white'>"+$scope.count + " order pending to accept </a>");
                           document.getElementById("myAudio").play();
                      } 
                           pageno = 2;
                      }
                    });
                      }  



//    $scope.getMapResult= function() {
//         var canvas = document.getElementById("barChart");
//         var ctx = canvas.getContext('2d');

//         // Global Options:
//         Chart.defaults.global.defaultFontColor = 'black';
//         Chart.defaults.global.defaultFontSize = 16;

//         var data = {
//           labels: ["Jan 2019", "Feb 2019", "Mar 2019", "Apr 2019", "May 2019", "Jun 2019", "Jul 2019", "Aug 2019", "Sep 2019", "Oct 2019", "Nov 2019", "Dec 2019"],
//           datasets: [{
//               label: "Price in Rupees",
//               fill: false,
//               lineTension: 0.1,
//               backgroundColor: "rgba(225,0,0,0.4)",
//               borderColor: "red", // The main line color
//               borderCapStyle: 'square',
//               borderDash: [], // try [5, 15] for instance
//               borderDashOffset: 0.0,
//               borderJoinStyle: 'miter',
//               pointBorderColor: "black",
//               pointBackgroundColor: "white",
//               pointBorderWidth: 1,
//               pointHoverRadius: 8,
//               pointHoverBackgroundColor: "yellow",
//               pointHoverBorderColor: "brown",
//               pointHoverBorderWidth: 2,
//               pointRadius: 4,
//               pointHitRadius: 10,
//               // notice the gap in the data and the spanGaps: true
//               data: [65, 59, 80, 81, 56, 55, 40, ,60,55,30,120],
//               spanGaps: true,
//             }
//           ]
//         };

//         // Notice the scaleLabel at the same level as Ticks
//         var options = {
//           scales: {
//                     yAxes: [{
//                         ticks: {
//                             beginAtZero:true
//                         },
//                         scaleLabel: {
//                              display: true,
//                              labelString: 'Price in Rupees',
//                              fontSize: 20 
//                           }
//                     }]            
//                 }  
//         };

//         // Chart declaration:
//         var myBarChart = new Chart(ctx, {
//           type: 'line',
//           data: data,
//           options: options
//         });



//         $scope.getSearchResult= function(){ 
//              // alert("hi");
//               if($scope.todate == '' || $scope.todate == undefined){
//                 $scope.todate = moment(new Date()).format("YYYY-MM-DD");
//              }
//              // alert($scope.todate);
//         }

// }
  



}]);