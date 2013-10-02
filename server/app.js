var fs = require("fs");
var express = require("express");
var mysql = require('mysql');
var color = require("string-color");
var server = module.exports = express();
//var socketProtocolServer;
var expressPort = 3000;
//var realTimePort = process.argv[3];
var stServer;


function getDate() {
	var d = new Date();

	function pad(n) {
		return n < 10 ? '0' + n : n;
	}
	return "[" + d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' +
		pad(d.getUTCDate()) + ' ' + pad(d.getUTCHours()) + ':' +
		pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + ']';
}


//allow res.render('someHtml.html')
var path = require('path');
var viewDir = path.join(__dirname, '../public');
server.set('view engine', 'ejs');
server.engine('html', function(filename, options, callback) {
	fs.readFile(filename, 'utf8', function(err, str){
        if(err) return callback(err);
        callback(null, str);
    });
});

server.use(express.static(__dirname + "/../public"));

var db = mysql.createConnection({
			host: '127.0.0.1',
			database: 'PiLights',
			user: 'root',
			password: ''
		});
db.connect(function(err) {
  	if(err) {
    	console.log("Looks like you can't connect to MySQL:".color("red", "reverse"), err);
  	} else {
    	console.log("Connected to MYSQL".color("blue", "reverse"));
  	}
});
server.db = db;

server.configure(function(){
  server.use(express.bodyParser());
  server.use(server.router);
});


//stServer = socketProtocolServer.listen(expressPort);
stServer = server.listen(expressPort);


//require('./Routes')(server, db);


