
/*** ============================================================== */
/** ======================== PAGE BUILDING ======================== **/
/* ============================================================== ***/
var mainApp;
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

var blogAdmin = function(req, res) {
	res.redirect(mainApp.locals.blogLink+"/ghost/")
}



//Export root functions
module.exports = function(app, passport) {
	mainApp = app;

	app.get("/login", login)

	app.all("/backend/*", authCheck);

	app.get('/backend', index);
	app.get('/backend/links', links);
	app.get('/backend/blog-admin', blogAdmin)
}