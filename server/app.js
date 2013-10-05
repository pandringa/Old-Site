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

//Adds layout to res, which renders header/footer
server.use(function(req, res, next){
	res.layout = function(page, obj){
		var data = obj || {};

		//SET DEFAULTS FOR VALUES TO BE RENDERED IN EJS
		data.title = data.title || 'Andrin.ga',
  		data.tags = data.tags || 'peter andringa, andringa, peter james andringa, peter andringa dc, andrin.ga, pja, peter andringa tj, peter andringa tjhsst ',
   		data.description = data.description || 'Andrin.ga - The personal website of Peter Andringa'
		data.test = data.test || 'THIS IS A TEST!';

		res.render(page, data, function(err, html){
			if(err) app.error(err);
			console.log(html);
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


require('./../routes/index')(server, db);


