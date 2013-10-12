var fs = require("fs");
var express = require("express");
var mysql = require('mysql');
var color = require("string-color");
var server = module.exports = express();
var port = 3000;
var appServer;
server.siteRootDomain = "http://andrin.ga/"; //Fill in later
var path = require('path');
var viewDir = path.join(__dirname, '../public');

server.set('view engine', 'ejs');
server.engine('html', function(filename, options, callback) {
	fs.readFile(filename, 'utf8', function(err, str){
        if(err) return callback(err);
        callback(null, str);
    });
});

server.use(express.static(__dirname + "/../public")); //Root folder of app

//Puts together webpages (header+page+footer)
server.use(function(req, res, next){
	res.layout = function(page, obj){
		var data = obj || {};

		//SET DEFAULTS FOR EJS
		data.title = data.title || 'Andrin.ga',
  		data.tags = data.tags || 'peter andringa, andringa, peter james andringa, peter andringa dc, andrin.ga, pja, peter andringa tj, peter andringa tjhsst ',
   		data.description = data.description || 'Andrin.ga - The personal website of Peter Andringa'
		data.test = data.test || 'THIS IS A TEST!';

		res.render(page, data, function(err, html){
			if(err) app.error(err);
			data.__yield = html;
			res.render('../views/layout', data);
		});
	};

	next();
});

server.use(express.cookieParser());
server.use(express.bodyParser());

var db = mysql.createConnection({
			host: '127.0.0.1',
			database: 'andringa',
			user: 'root',
			password: ''
		});

function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: '.color("red", "reverse"), err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect(function(err) {
	  	if(err) {
	    	console.log("Error trying to reconnect to mySQL:".color("red", "reverse"), err);
	  	} else {
	    	console.log("Reconnected to MYSQL".color("blue", "reverse"));
	  	}
	});
  });
}

handleDisconnect(db); //Manages disconnections of DB
db.connect(function(err) {
  	if(err) {
    	console.log("MySQL Connection error:".color("red", "reverse"), err);
  	} else {
    	console.log("Connected to MYSQL".color("blue", "reverse"));
  	}
});
server.db = db;

server.configure(function(){
  server.use(express.bodyParser());
  server.use(server.router);
});

mainServer = server.listen(port);

require('./../routes/index')(server, db);

console.log('Server Running!'.color("green"));
