
/*** ============================================================== */
/** ======================== PAGE BUILDING ======================== **/
/* ============================================================== ***/

//home page
var index = function(req, res) {
	console.log("in index")
  	res.layout('index', {
  		title: 'Andrin.ga',
   		description: 'Andrin.ga - The personal website of Peter Andringa',
   		test: 'This is test text from the index'
  	});
};

var about = function(req, res) {
	res.layout('about', {
		title: 'About | Andrin.ga',
   		description: 'About Peter Andringa'
	})
};


//Export root functions
module.exports = function(app, passport) {
	app.get('/', index);
	app.get('/about', about);

	//Sample 301 redirect for old pages
	/*
	app.get('/old-page-name', function(req, res) {
		res.redirect(301, app.siteRootDomain+"/new-page");
	});
	*/
}
