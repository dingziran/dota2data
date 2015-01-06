var app=angular.module('info',[]);  
app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /dashboard
  $urlRouterProvider.otherwise("/dashboard");
  //
  // Now set up the states
  $stateProvider
    .state('info', {
      url: "/info",
      templateUrl: "app/info/info.html",
      controller: function($scope,dotaService) {
        $scope.online=0;
        $scope.update=function(){
            
             $.ajax({
                 type: "GET",
                 url: "https://api.mongolab.com/api/1/databases?apiKey=U0ILXvPGN6SC7otpblL5agQ2D7YQikuB",
                 dataType: "json",
                 success: function(data){
                     console.log(data);
                }
             });    
            
            
            
            
            
            
            dotaService.getOnlineNumber().success(function(data){
                $scope.online=data.response.player_count;
                console.log(data);
            })    
        }
      }
    });
});

app.factory('dotaService', function($http) {
    var key="698ECDBD52EE9706F7F398385358F474";
    //Public Method
    var service = {
        getOnlineNumber:function(){ 
            var get=$http.get("/getOnlineNumber");
            return get;
        }
    };
    return service;
});
app.factory('mongolabService',function(){
    
});
