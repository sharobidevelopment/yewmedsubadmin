/**
 * 
 */
'use strict';

angular.module('myApp').controller('LoginController', ['$scope', '$cookies', '$location', '$interval', 'LoginService', 'Idle', 'Keepalive', '$route', '$rootScope', function($scope, $cookies, $location, $interval, LoginService, Idle, Keepalive, $route, $rootScope) {
    var self = this;
    self.user = {email: '',password: ''};
    self.login = login;
    self.logout = logout;

    self.successMessage = '';
    self.errorMessage = '';

    //$rootScope.contextpath = "/yewmedsubadmin"

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


    var tick = function() {
    $scope.clock = Date.now();
    }
    tick();
    $interval(tick, 1000);

    
    var promise;
    $scope.events = [];
    $scope.storeStatusCookie = $cookies.get('StoreStatus');
    // alert($scope.storeStatusCookie);
    if ($scope.storeStatusCookie === undefined) {
           $location.path($rootScope.contextpath + "/");
           $scope.storeStatusCookie = 'Deactive';
       }
    else if ($scope.storeStatusCookie === 'Deactive') {
           $location.path($rootScope.contextpath + "/");
       }



    $scope.$on('IdleStart', function() {
        // the user appears to have gone idle
        console.log("Idle");
        if ($scope.storeStatusCookie == 'Active') {
            //alert("active");
            promise = $interval(callAtInterval, 10000); // Start calling callAtInterval function in 10 second interval
        }
    });

    
    $scope.$on('IdleEnd', function() {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        $interval.cancel(promise); // stop calling callAtInterval function
    });



    function callAtInterval() {
        console.log("Interval occurred");
        // call for new token
    }


    function login() {
        LoginService.loginRequest(self.user)
            .then(
                function successCallback(response) {

                    $cookies.put('storeToken', response.headers('Authorization'));
                    $cookies.put('StoreStatus', 'Active');
                    $scope.storeStatusCookie = 'Active';
                    
                    // need to change(set  location lat lng of store)
                    var latitude = '22.57139428';
                    var longitude = '88.35056187';
                    //
                    localStorage.setItem("userlat", latitude);
                    localStorage.setItem("userlng", longitude);
                    getStoreDetails(); // call for geting login user data with address

                    $location.path($rootScope.contextpath + "/home");
                  },
                  function error(response) {
                    $scope.msg = "Invalid login credentials";
                  }
                /*function(errResponse){
                    console.error('Error while creating User');
                }*/
            );
    }
    
 function  getStoreDetails(){
        LoginService.callStoreDetailsAddressData()
            .then(
                function successCallback(response) {
                   /* alert(JSON.stringify(response));*/
                    console.log("Address::"+JSON.stringify(response));
                    localStorage.setItem("loggedinuserdetails", JSON.stringify(response.data));
                    $rootScope.activeusername=response.data.name;
                    $route.reload();
                },
                function error(response) {
                    
                }

            );
        }

    $scope.reset = function() {
        self.user = {email: '',password: ''};
        $scope.loginForm.$setPristine();
        $scope.loginForm.$setUntouched();
        $scope.msg = "";

    }
    
    function logout() {
        $cookies.put('StoreStatus', 'Deactive');
        $scope.storeStatusCookie = 'Deactive';
       
        $location.path($rootScope.contextpath + "/");
        
      
        /*localStorage.removeItem("userlat");
        localStorage.removeItem("userlng");
        localStorage.removeItem("loggedinuserdetails");*/
        
        //$rootScope.activeusername='User'; 
       
    }

    
  



}]);