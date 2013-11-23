
/*** ============================================================== */
/** ======================== PAGE BUILDING ======================== **/
/* ============================================================== ***/
var fuzzySet = require('fuzzyset.js');
var app, db;
//home page
var authCheck = function(req, res, next){
	//Do something
	console.log('checking auth')

	//If user isn't legit: then you would
	//res.redirect(301, '/login')

	//If user is legit, then
	next();
}

var login = function(req, res) {
	var data={
		title: "Login to the Admin Panel"
	};
	res.render('login', data);
}

var index = function(req, res) {
  	res.layout('index', {
  		title: 'Admin Panel',
   		site: 'backend'
  	});
};

var links = function(req, res) {
	res.layout('links', {
  		title: 'Admin Panel | Link Shortener',
   		site: 'backend'
  	});
}

var shorten = function(req, res) {
	db.query("SELECT href FROM links WHERE title=?", req.route.params[0], function(err, result){
		if(result.length > 0)
			res.redirect(result[0].href);
		else{
			req.suggestions = [];
			db.query("SELECT title FROM links", function(err, result){
				console.log("DONE 2", result);
				var suggestions = FuzzySet();
				for(var i=0; i<result.length; i++)
					suggestions.add(result[i].title);
				req.suggestions = suggestions.get(req.route.params[0]);
				console.log("SUGGESTIONS", req.suggestions);
				res.render('backend/noLink', req);
			});
		}
	});
}

var blogAdmin = function(req, res) {
	res.redirect(mainApp.locals.blogLink+"/ghost/")
}



//Export root functions
module.exports = function(app, passport) {
	app = app;
	db = app.db;
	
	/*
	app.get("/login", login)

	app.all("/backend/*", authCheck);

	app.get('/backend', index);
	app.get('/backend/links', links);
	app.get('/backend/blog-admin', blogAdmin);
	*/

	app.all("/*", shorten); //IMPORTANT that this one is last
}
