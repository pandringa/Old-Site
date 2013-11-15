var fs = require("fs");
var express = require("express");
var mysql = require('mysql');
var color = require("string-color");
var server = module.exports = express();
var port = 3001;
var appServer;
server.siteRootDomain = "http://andrin.ga/"; //Fill in later
var path = require('path');
var viewDir = path.join(__dirname, '../public');

var mainLink = "http://peterandrin.ga/";
var blogLink = "http://blog.peterandrin.ga/";

server.set('view engine', 'ejs');
server.engine('html', function(filename, options, callback) {
	fs.readFile(filename, 'utf8', function(err, str){
        if(err) return callback(err);
        callback(null, str);
    });
});

var week = 604800000;
server.use(express.static(__dirname + "/../public", {maxAge: week})); //Sets caching for static files
server.use(express.compress()); //GZIP compression



server.use(function(req, res, next){
	res.layout = function(page, obj){ //Puts together webpages (header+page+footer)
		var data = obj || {};

		//SET DEFAULTS FOR EJS
		data.title = data.title || 'Andrin.ga',
  		data.tags = data.tags || 'peter andringa, andringa, peter james andringa, peter andringa dc, andrin.ga, pja, peter andringa tj, peter andringa tjhsst ',
   		data.description = data.description || 'Andrin.ga - The personal website of Peter Andringa'
		data.test = data.test || 'THIS IS A TEST!';
    data.mainLink = mainLink;
    data.blogLink = blogLink;
		//BAKEND OR FRONTEND, DEFAULTS TO FRONTEND
		var site = data.site || "frontend"; 


		res.render(site+'/'+page, data, function(err, html){
			if(err) console.error(err);
			data.__yield = html;
			res.render('../views/'+site+'/layout', data);
		});
	};

	next();
});

//Redirects all users to http://andrin.ga who are at www.andrin.ga
server.use(function(req, res, next) {
  console.log("Loaded!");
  if (req.headers.host.match(/^www/) !== null ) {
  	console.log("Redirecting:", 'http://'+req.headers.host+req.url, "to", 'http://'+req.headers.host.replace(/^www\./, '')+req.url)
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();     
  }
})

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

//Locals
server.locals.mainLink = mainLink;
server.locals.blogLink = blogLink;


require('./../routes/frontend')(server, db);
require('./../routes/backend')(server, db);

console.log('Server Running!'.color("green"));
