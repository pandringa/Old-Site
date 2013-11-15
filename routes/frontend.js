
var when = require("when");
/*** ============================================================== */
/** ======================== PAGE BUILDING ======================== **/
/* ============================================================== ***/
var app;
var db;
var blogLink = "http://localhost:3002";
//home page
var index = function(req, res) {
  	res.layout('index', {
  		title: 'Andrin.ga',
   		description: 'Andrin.ga - The personal website of Peter Andringa',
   		test: 'This is test text from the index',
   		highlight: 'nav-home'
  	});
};

var home = function(req, res) {
   	//Helper functions
    function loadPosts(){
    	var deferred = when.defer();
    	db.query("SELECT * FROM posts WHERE status='published' ORDER BY published_at desc LIMIT 5", function(err, rows){
	    	if(!err){
	    		deferred.resolve(rows);
	    	}
	    	else{
	    		console.error("Blog Post Query Failed", err);
	    		deferred.reject(err);
	    	}
	    });
	    return deferred.promise;
    }
    function loadProjects(){
    	var deferred = when.defer();
	    db.query("SELECT * FROM projects", function(err, rows){
	    	if(!err){
	    		deferred.resolve(rows);
	    	}
	    	else{
	    		console.error("Projects Query Failed", err);
	    		deferred.reject(err);
	    	}
	    });
	    return deferred.promise;
	}

	//Data model
	var data = {};
	data.blogLink = blogLink;
	var requests = [loadPosts(), loadProjects()];

	//When our DB requests are done
    when.all(requests).then(function(results){
    	data.posts = results[0];
    	data.projects = results[1];

    	//Render the page!
    	res.render('../views/frontend/home', data);

    }, function(err){
    	console.error("Error retrieving database data", err);
    });
    
}

var about = function(req, res) {
	res.layout('about', {
		title: 'About | Andrin.ga',
   		description: 'About Peter Andringa',
   		highlight: 'nav-about'
	})
};

var projects = function(req, res) {
	res.layout('projects', {
		title: 'Projects | Andrin.ga',
   		description: 'Peter\'s Current Projects',
   		highlight: 'nav-projects'
	})
};

var blog = function(req, res) {
	res.redirect(mainApp.locals.blogLink);
};

var admin = function(req, res) {
	res.redirect('http://www.youtube.com/embed/oHg5SJYRHA0?autoplay=1'); //Link to a certain special music video
};



//Export root functions
module.exports = function(app, passport) {
	app = app;
	db = app.db;
	app.all("*", function (req, res, next){
		if (req.headers.host.match(/^www\./)) {
			console.log("Redirecting...");
		    res.redirect(301, 'http://andrin.ga');
		} else { 
			return next();
		}
	});

	app.get('/', index);
	app.get('/about', about);
	app.get('/projects', projects)
	app.get('/blog', blog);
	app.get('/admin-panel', admin);
	app.get('/home', home);
}
