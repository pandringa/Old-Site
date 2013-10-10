
/*** ============================================================== */
/** ======================== PAGE BUILDING ======================== **/
/* ============================================================== ***/

//home page
var index = function(req, res) {
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
	//redirect www.andrin.ga to andrin.ga
	app.all("*", function (req, res, next){
		console.log("Visitor!");
		if (req.headers.host.match(/^www\./)) {
			console.log("Redirecting...");
		    res.redirect(301, 'http://andrin.ga');
		} else { 
			return next();
		}
	});

	app.get('/', index);
	app.get('/about', about);
}
