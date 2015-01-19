//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var https = require('https');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));

router.get('/getOnlineNumber',function(req,outer_res){
  http.get("http://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1?appid=570&format=json",function(res){
    	var size = 0;
    	var chunks = [];
    	res.on('data', function(chunk){
    	  size += chunk.length;
    	  chunks.push(chunk);
    	});
    	res.on('end', function(){
    	  var data = Buffer.concat(chunks, size);
        outer_res.send(data);
    	});

  })
})

function getOnlineNumber(){
  console.log("start at "+new Date().toDateString());
  var records=[];
  setInterval(function(){
      http.get("http://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1?appid=570&format=json",function(res){
      	var size = 0;
      	var chunks = [];
      	res.setEncoding('utf8');
      	res.on('data', function(chunk){
      	  size += chunk.length;
      	  chunks.push(chunk);
      	});
      	res.on('end', function(){
      	  var data = Buffer.concat(chunks, size);
          records.push({close:JSON.parse(data).response.player_count,date:new Date(new Date().getTime())});
    	  });

      })
      if(records.length>4){
        saveToMongoDB(records);
        records=[];
      }
    
  },1000*60*5);
}
function saveToMongoDB(records){
  var options = {
    hostname: 'api.mongolab.com',
    path: '/api/1/databases/dota2data/collections/online?apiKey=U0ILXvPGN6SC7otpblL5agQ2D7YQikuB',
    method: 'POST',
    headers: {  
        "Content-Type": 'application/json'
    }
  };
  
  var req = https.request(options, function(res) {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
       console.log('BODY: ' + chunk);
    });
  });
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  
  // write data to request body
  req.write(JSON.stringify(records));
  req.end();
}


getOnlineNumber();

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
