var app=angular.module('online',[]);  
app.config(function($stateProvider, $urlRouterProvider) {
  //
  // Now set up the states
  $stateProvider
    .state('online', {
      url: "/online",
      templateUrl: "app/online/online.html",
      controller: function($scope,mongolabService) {
        $scope.data=[];
        $scope.stop=0;
        $scope.info=function(){
            
        }
        $scope.update=function(){
            chart.render();
        }
        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;
        var now = new Date();
        var colorScale=d3.scale.category10();
        var chart = lineChart()
            //.x(d3.time.scale().domain([new Date(now.getTime()-1000*60*60*24), now]))
            .x(d3.time.scale().domain([new Date(now.getFullYear(),now.getMonth(),now.getDate()),new Date(now.getFullYear(),now.getMonth(),now.getDate()+1)]))
            .y(d3.scale.linear().domain([300000, 1000000]))
            .colors(colorScale)
            .data($scope.data);
        
        for(var i=0;i<5;i++){
            (function(i){
                //mongolabService.getOnlineNumber(new Date(now.getTime()-1000*60*60*24  *(1+i)), new Date(now.getTime()-1000*60*60*24  *i)).success(function(data){
                mongolabService.getOnlineNumber(new Date(now.getFullYear(),now.getMonth(),now.getDate()-i),new Date(now.getFullYear(),now.getMonth(),now.getDate()-i+1) ).success(function(data){
                    data.forEach(function(d){
                        d.date=new Date(parseDate(d.date).getTime()+8*60*60*1000 +1000*60*60*24  * i);
                    })
                    console.log(data);
                    console.log("Got Data!");
                    $scope.data[i]=data;
                });    
            })(i);
        }
        for(i=0;i<5;i++){
            d3.select("#color")
                .append("div").classed("cell", true)
                    .style("display", "inline-block")
                    .style("background-color", function(){ // <-D
                    console.log(colorScale(i));
                        return colorScale(i);
                    })
                    .text(function (d) { // <-E
                        return i;
                    });
        }
                            
        // mongolabService.getOnlineNumber(new Date(now.getTime()-1000*60*60*24), now).success(function(data){
        //     data.forEach(function(d){
        //         d.date=new Date(parseDate(d.date).getTime()+8*60*60*1000);
        //     })
        //     console.log("Got Data!");
        //     chart.addSeries(data);
        //     mongolabService.getOnlineNumber(new Date(now.getTime()-1000*60*60*24  *2), new Date(now.getTime()-1000*60*60*24  *1)).success(function(data){
        //         data.forEach(function(d){
        //             d.date=new Date(parseDate(d.date).getTime()+8*60*60*1000 +1000*60*60*24  *1);
        //         })
        //         console.log("Got Data!");
        //         chart.addSeries(data);
        //     });    
        // });    
        
        
        
        
        
        function lineChart(){
            var _chart={};
            var _width=600, _height=300,
                _margins={top:30,left:100,right:30,bottom:30},
                _x,_y,
                _data=[],
                _colors=d3.scale.category10(),
                _svg,
                _bodyG,
                _line;
                
            _chart.render = function () { // <-2A
                if (!_svg) {
                    _svg = d3.select("#chart").append("svg") // <-2B
                        .attr("height", _height)
                        .attr("width", _width);
                    renderAxes(_svg);
                }
                renderBody(_svg);
            };
            
            function renderBody(svg) { // <-2D
                if (!_bodyG)
                    _bodyG = svg.append("g")
                        .attr("class", "body")
                        .attr("transform", "translate("
                            + xStart() + "," 
                            + yEnd() + ")") // <-2E
                        .attr("clip-path", "url(#body-clip)"); 
                renderLines();
                
            }
            function renderAxes(svg) { // <-3A
                var axesG = svg.append("g")
                    .attr("class", "axes");
                renderXAxis(axesG);
                renderYAxis(axesG);
            }
            
            function renderXAxis(axesG){
                var format = d3.time.format("%X");
                var xAxis = d3.svg.axis()
                        .scale(_x.range([0, quadrantWidth()]))
                        .orient("bottom")
                        .tickFormat(function(v){
                            return format(v);
                        });        
                axesG.append("g")
                        .attr("class", "x axis")
                        .attr("transform", function () {
                            return "translate(" + xStart() + "," + yStart() + ")";
                        })
                        .call(xAxis);
                        
                // d3.selectAll("g.x g.tick")
                //     .append("line")
                //         .classed("grid-line", true)
                //         .attr("x1", 0)
                //         .attr("y1", 0)
                //         .attr("x2", 0)
                //         .attr("y2", - quadrantHeight());
            }
            
            function renderYAxis(axesG){
                var yAxis = d3.svg.axis()
                        .scale(_y.range([quadrantHeight(), 0]))
                        .orient("left");
                        
                axesG.append("g")
                        .attr("class", "y axis")
                        .attr("transform", function () {
                            return "translate(" + xStart() + "," + yEnd() + ")";
                        })
                        .call(yAxis)
                    .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text("Players");
                                            
                //  d3.selectAll("g.y g.tick")
                //     .append("line")
                //         .classed("grid-line", true)
                //         .attr("x1", 0)
                //         .attr("y1", 0)
                //         .attr("x2", quadrantWidth())
                //         .attr("y2", 0);
            }

            function renderLines() {
                _line = d3.svg.line() 
                                .x(function (d) { return _x(d.date); })
                                .y(function (d) { return _y(d.close); });
                                
                _bodyG.selectAll("path.line")
                            .data(_data)
                        .enter() //<-4B
                        .append("path")                
                        .style("stroke", function (d, i) { 
                            return _colors(i); //<-4C
                        })
                        .attr("class", "line");
                _bodyG.selectAll("path.line")
                        .data(_data)
                        .transition() //<-4D
                        .attr("d", function (d) { return _line.tension(1)(d); });
            }
                
            function xStart() {
                return _margins.left;
            }
            function yStart() {
                return _height - _margins.bottom;
            }
            function xEnd() {
                return _width - _margins.right;
            }
            function yEnd() {
                return _margins.top;
            }
            function quadrantWidth() {
                return _width - _margins.left - _margins.right;
            }
            function quadrantHeight() {
                return _height - _margins.top - _margins.bottom;
            }
            _chart.width = function (w) {
                if (!arguments.length) return _width;
                _width = w;
                return _chart;
            };
            _chart.height = function (h) { // <-1C
                if (!arguments.length) return _height;
                _height = h;
                return _chart;
            };
            _chart.margins = function (m) {
                if (!arguments.length) return _margins;
                _margins = m;
                return _chart;
            };
            _chart.colors = function (c) {
                if (!arguments.length) return _colors;
                _colors = c;
                return _chart;
            };
            _chart.x = function (x) {
                if (!arguments.length) return _x;
                _x = x;
                return _chart;
            };
            _chart.y = function (y) {
                if (!arguments.length) return _y;
                _y = y;
                return _chart;
            };
            _chart.data = function (data) { // <-1D
                _data=data;
                return _chart;
            };
            return _chart; // <-1E
               
        }
      }
    });
});

