
/*** ============================================================== */
/** ======================== PAGE BUILDING ======================== **/
/* ============================================================== ***/
var mainApp;
//home page
var index = function(req, res) {
  	res.layout('index', {
  		title: 'Andrin.ga',
   		description: 'Andrin.ga - The personal website of Peter Andringa',
   		test: 'This is test text from the index',
   		highlight: 'nav-home'
  	});
};

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
	mainApp = app;

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
}
