// edit - this is an attempt to get the spirograph example a bit more prettier and less dependent on whethere or not the 
// 		tab is active.
// analytics with the top 3 or so maxes thrown away as aberations. 
//            time                    t_scale
//min is:    0.000851957				min is:	4	
//Avg is:	0.005283211				Avg is:	25.3858885	
//max is:	0.049839504				max is:	1019	
//diff of time ticker					starts at 500 ends at 30,000 		

 
var debug = "false"; // change to true to see debug data
var time_step = 12; // imitates average increment from time function but is a constant so display should be smoother. 
var playtime = 500;

var goplaytime = function() { // get next time step.
	
	playtime = playtime+ time_step;
	
	return playtime;
};



var divd = document.getElementById('debug'); 
var width = 600,
    height = 600,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var position = function (t) {
    var a = 80, b = 1, c = 1, d = 80;

    return {x: Math.cos(a*t) - Math.pow(Math.cos(b*t), 3),
            y: Math.sin(c*t) - Math.pow(Math.sin(d*t), 3)};
};

var plotw = width-100; // set these up to explore changing the scale later.
var plotw2 = 100;
var ploth = height-100;
var ploth2 = 100;

var t_scale = d3.scale.linear().domain([500, 30000]).range([0, 2*Math.PI]),
    x = d3.scale.linear().domain([-2, 2]).range([plotw2, plotw]),
    y = d3.scale.linear().domain([-2, 2]).range([ploth, ploth2]);

var brush = svg.append('circle')
        .attr({r: 4}),
    previous = position(0);

var colordraw = 'red'; //initial color of drawing
 
function change_color(){
	if(colordraw == 'red'){
			colordraw ='orange';
			return;
		}

		if(colordraw == 'orange'){
			colordraw ='yellow';
			return;
		}
		if(colordraw =='yellow'){
			colordraw ='green';
			return;
		}
		if(colordraw =='green'){
			colordraw ='blue';
			return;
		}
		if(colordraw =='blue'){
			colordraw ='violet';
			return;
		}
		if(colordraw =='violet'){
			colordraw ='red';
			return;
		}
		return;

}
 
 
 
var step = function (time) {
    if (time > t_scale.domain()[1]) {
        return true;
    }
    
    var t = t_scale(time),
        pos = position(t);
		if(debug == "true"){
		divd.innerHTML = divd.innerHTML + '<br> '+t + ' '+ time;
		}
		
		change_color();
		
		if(debug == "true"){
		divd.innerHTML = divd.innerHTML + ' '+ colordraw;
		}
	
    brush.attr({cx: x(pos.x),
                cy: y(pos.y)});
    svg.append('line')
        .attr({x1: x(previous.x),
               y1: y(previous.y),
               x2: x(pos.x),
               y2: y(pos.y),
               stroke: colordraw,
               'stroke-width': 1.3});

    previous = pos;
};

//var timer = d3.timer(step, 500); //original function

var hotstepper = function () {  //added function
	var sheeptime = goplaytime();

    if (sheeptime > t_scale.domain()[1]) {
        return true;
    }
    
    var t = t_scale(sheeptime),
        pos = position(t);
        if(debug == "true"){
	divd.innerHTML = divd.innerHTML + '<br> '+t + ' '+ sheeptime;
        }
		change_color();
		if(debug == "true"){
		divd.innerHTML = divd.innerHTML + ' '+ colordraw;
		}
		
    brush.attr({cx: x(pos.x),
                cy: y(pos.y)});
    svg.append('line')
        .attr({x1: x(previous.x),
               y1: y(previous.y),
               x2: x(pos.x),
               y2: y(pos.y),
               stroke: colordraw,
               'stroke-width': 1.3});

    previous = pos;
};


var e_sheep = d3.timer(hotstepper); // new call to invoke function