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
      controller: function($scope,dotaService,mongolabService) {
        $scope.data=[];
        $scope.stop=0;
        $scope.info=function(){
            
        }
        $scope.update=function(){
            var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;
            var end=new Date().getTime();
            var start=end-1000*60*60*24;
            mongolabService.getOnlineNumber(new Date(start),new Date(end)).success(function(data){
                $scope.data=data;
                $scope.data.forEach(function(d){
                    d.date=new Date(parseDate(d.date).getTime()+8*60*60*1000);
                })
                console.log("Got it!");
                render($scope.data);
            });    
                    
        }
        // $scope.draw=function(){
        //     var len=Math.random()*10;
        //     console.log(len);
        //     for(var i=0;i<len;i++){
        //         newData.push({date:i,close:2*i});
        //     }
        //     render(newData);
            
        // }
        
        
        
        // for(var i=0;i<10;i++){
        //     $scope.data.push({date:i,close:2*i});
        // }
        

            
        var margin = {top: 20, right: 20, bottom: 30, left: 100},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
            
        var x = d3.time.scale()
            .range([0, width]);
        
        var y = d3.scale.linear()
            .range([height, 0]);
            
        var format = d3.time.format("%X");
        
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5)
            .tickFormat(function(v){
                return format(v);
            });
        
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
        
        
        var line = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });
        
        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
        
        function render(data){  
            // console.log('render')
            
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain(d3.extent(data, function(d) { return d.close; }));
          
            
          svg.selectAll("g").remove();
          
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
        
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Players");  
            
          svg.selectAll("path.line")
              .data([data])
              .enter()
              .append("path")
              .attr("class", "line")
              .attr("d", line);
          svg.selectAll("path.line")
              .data([data])
              .attr("d", line);
        }
        
        // render(data);
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
app.factory('mongolabService',function($http){
    var key="U0ILXvPGN6SC7otpblL5agQ2D7YQikuB";
    var service = {
        getOnlineNumber:function(start,end){
            var query={date: {$gte: start, $lt: end}};
            return $http.get("https://api.mongolab.com/api/1/databases/dota2data/collections/online?q="+JSON.stringify(query)+"&apiKey="+key);
            // return $http.get("https://api.mongolab.com/api/1/databases/dota2data/collections/online?apiKey="+key);
            
        }
    }
    return service;
});
