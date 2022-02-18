'use strict';

angular.module('myApp').controller('DeliveryPersonController', ['$scope', '$http','$cookies', '$location',  '$route', '$rootScope','DeliverOrderService', 'OrdertakingService' , '$interval' , function($scope,$http, $cookies, $location, $route, $rootScope,DeliverOrderService,OrdertakingService,$interval) {
    var self = this;

    $scope.orders=[];
    $scope.itemid=0;
    $scope.search=0;
    var page=2;
    var pageno1=2;
    $scope.limit = 10;
    $scope.interval_count = 0;
    //$scope.availablepincode = [700131,700054,700101,700124,721401,742159,700091,700067,700121,700048,743222,700107,721155,743704,712404,711414,721140,766015,766014,766001,766012,766018,493890];
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



      $scope.deliveryperson = {};
      
      self.deliverypersonSubmit = deliverypersonSubmit;

      // ................................ pincode api cal.............................
        $http.get(serverurl + "/users/getAllPincodesUserId", {
            headers: {
                'Authorization': tokenCookie
            }
        })
        .then(
            function(response) {
                
            $scope.availablepincode = response.data;
        },
        function(errResponse){   
        }
        );    
        // ................................ pincode api cal end .............................


      function deliverypersonSubmit(){
         //alert("hiii");
         //let selecteitem = [];
         $( ".deliveryperson_button" ).prop( "disabled", true );
         var pincodeobj = {
          //"pincode":""
         }
         var pincodearr = [];
         console.log($scope.deliveryperson);
         //self.deliveryperson.deliveryPin = [{"pincode":"700031"},{"pincode":"700030"}];
         $scope.deliveryperson.loginType = "DELIVERY_PERSON";
         var pincodes = document.getElementsByName("selecteditem_checkbox");
         console.log(pincodes);
         for (var i = 0; i < pincodes.length; i++) {
                if (pincodes[i].checked) {
                  //var pincodeobj1 = {};
                    //selecteitem.push(pincodes[i].value);
                    // alert(JSON.stringify(selecteitem));
                    pincodeobj['pincode'] = pincodes[i].value;
                    //var pincodeobj1 = pincodeobj;
                    pincodearr.push({'pincode':pincodes[i].value});
                }
                
            }
            console.log(pincodearr);
            $scope.deliveryperson.deliveryPin = pincodearr;
            if(pincodearr.length>0){
         $http.post(serverurl+"/delivery/register",$scope.deliveryperson,{                 
      headers:{'Authorization': tokenCookie}
          })
         //$http.post(serverurl+"/delivery/register",self.deliveryperson)
       .then(
       function (response) {
         // console.log("response:"+
         //alert("hiiiiii");
         if(response.data.status == 0){
            alertify.error(response.data.message);
            $( ".deliveryperson_button" ).prop( "disabled", false );
            //$(".deliveryperson_checkbox").prop("checked", false);
         }
         else{
             $scope.deliveryperson = {};
             //document.getElementsByName("selecteditem_checkbox").checked = false; 
             $(".deliveryperson_checkbox").prop("checked", false);
             $scope.deliverPersonForom.$setPristine();
             $scope.deliverPersonForom.$setUntouched();
             alertify.success(response.data.message);
             $( ".deliveryperson_button" ).prop( "disabled", false );
        }
        
       },
       function(errResponse){
          console.error("errResponse:"+'Error while adding users address');
           // $(".deliveryperson_checkbox").prop("checked", true);
           alertify.error("Some Error Occurred.");
           $( ".deliveryperson_button" ).prop( "disabled", false );
       }
   );
     }
     else{
       alertify.error("Please select pincode.");
       $( ".deliveryperson_button" ).prop( "disabled", false );
     }
      }


}]);