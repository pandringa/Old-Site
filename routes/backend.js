
/*** ============================================================== */
/** ======================== PAGE BUILDING ======================== **/
/* ============================================================== ***/

//home page
var authCheck = function(req, res, next){
	//Do something
	//If user is legit, then
	console.log('checking auth')
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



//Export root functions
module.exports = function(app, passport) {
	app.get("/login", login)

	app.all("/backend/*", authCheck);

	app.get('/backend', index);
	app.get('/backend/links', links);
}
