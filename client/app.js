var app=angular.module("dota2data",['ui.router','info']);  
app.config(function($stateProvider,$httpProvider, $urlRouterProvider) {
      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  //
  // For any unmatched url, redirect to /dashboard
  $urlRouterProvider.otherwise("/dashboard");
  //
  // Now set up the states
  $stateProvider
    .state('dashboard', {
      url: "/dashboard",
      templateUrl: "dashboard.html"
    });
});

app.controller('dashboardController',function($scope){
      //define data
  var dataset=[1,2,3,4,5,6,5,4,3,2,1,2,3,4,5,6,7,8,9];

  //define svg
  var width=500;
  var height=400;
  var x=d3.scale.linear()
          .range([0,width]);
  var y=d3.scale.linear()
          .range([height,0]);
  var svg = d3.select('#barChart').append('svg')
    .attr('width', width) 
    .attr('height', height);
  
  //
  function render(data){
    y.domain([0,100]);
    d3.select("svg").selectAll("rect")
      .data(data)
      .enter()
      .append('rect');

    d3.select("svg").selectAll("rect")
      .data(data)
      .attr({
        x:function(d,i){return i*(width/data.length)},
        y:function(d){return y(d)},
        width:(width/data.length-3),
        height:function(d){return height-y(d)},
        fill:function(d){return 'rgb(0,0,'+d*3+')';}
      });
    d3.select("svg").selectAll("rect")
      .data(data)
      .exit()
      .remove();
  }
  setInterval(function(){
      console.log("refresh");
    dataset.shift();
    dataset.push(Math.round(Math.random()*100));
    render(dataset);
  },1000);
  render(dataset);
});