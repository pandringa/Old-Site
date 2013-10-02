var Sendgrid = require("sendgrid").SendGrid;
var Email = require('sendgrid').Email;
var generatePassword = require('password-generator');
var sendgrid = new Sendgrid("dan@socialtables.com", "sitwithme");
var ejs = require('ejs');
var fs = require('fs');
var request = require('request');
var nconf = require("nconf");
var path = require('path');
var welcome_email = fs.readFileSync(path.join(__dirname, '../emails/welcome.ejs'), 'utf8')
var when = require('when');
var hostname;
	switch (nconf.get("S2_ENV")) {
		case 'development':
			hostname = 'http://localhost:3000';
			break;
		case 'staging':
			hostname = 'https://lab.socialtables.com'
			break;
		case 'production':
			hostname = 'https://www.socialtables.com'
			break;
		default:
			hostname = 'https://www.socialtables.com'
			break;
	}


module.exports = function(server, db) {
	server.get('/user/current', function(req, res) {
		res.json(200, req.user);
	});


	//responds with an array of events from events table, JSON
	//Responds with all events owned by team if user is an admin
	//Checks events against event permissions table if user isn't admin
	server.get('/user/:user/events', function(req, res) {
		console.log("endpoint hit")
		var query = db.query("SELECT DISTINCT e.*, ep.access_type " +
			"FROM events AS e " +
			"INNER JOIN event_permissions AS ep " +
			"ON e.id = ep.event_id " +
			"WHERE ep.user_id = ? " +
			"AND e.is_archived = 0 "+
			"ORDER BY e.id DESC ",
			[req.params.user],
			function(err, events) {
				if(err) {
					res.json(500, {error: err});
					console.error(err, query.sql)
				}
				else {
					res.json(200, events);
				}
			});
	});

	server.get('/user/:user/last_login', function(req, res) {
		console.log("endpoint hit");
		var query = db.query("SELECT last_accessed FROM events WHERE user_id=? ORDER BY last_accessed desc LIMIT 1",
			[req.params.user],
			function(err, results) {
				if(err) {
					res.json(500, {error: err});
					console.error(err, query.sql)
				}
				else {
					console.log("RESULTS!!!", results);
					if(results[0]){
						console.log(results[0].last_accessed);
					res.json(200, results[0].last_accessed);
				} else {
					console.log("user doesn't have any events");
					res.json(200, ["N/A"]);
				}

				}
		});
	});

	//responds with all user information
	server.get('/user/all', function(req, res) {
		if(!req.user.is_admin) res.send(403, settings.www+'/login'); // admins only
		var query = db.query("SELECT id, first_name, last_name, email_address, event_limit, trial, opt_out, is_venue, is_aim, team_id "
			+ "FROM users ORDER BY id desc",
			[],
			function(err, results) {
				if(err) {
					res.json(500, {error: err});
					console.error(err, query.sql)
				}
				else {
					res.json(200, results);
				}
			});
	});
	//responds with user information
	server.get('/user/:user/upgrade', function(req, res) {
		console.log("upgrading user", req.user);
		var query = db.query("UPDATE users "
			+ "SET event_limit=100, trial=0, trial_expires_at=NULL, upgraded=1 "
			+ "WHERE id = ?",
			[req.params.user],
			function(err, results) {
				if(err) {
					res.send(500, "Error: couldn't upgrade the user");
					console.error(err, query.sql)
				}
				else {
					res.json(200, "OK");
				}
			});
	});

	server.get('/user/:user/welcome', function(req, res) {
		console.log("welcoming  user");
		var admin = req.user;
		console.log("admin user: ", admin);
		var user;

		var query = db.query("SELECT first_name, email_address, password_reset_code FROM users WHERE id = ?", [req.params.user], function(err, result) {
			if(err) {
				console.error(err, query.sql)
			} else {
				user = result[0];
				console.log("On s2, password code is ", user.password_reset_code);
				var login_link;
				if(user.password_reset_code){
					login_link = hostname+"/users/"+req.params.user+"/reset-password?token="+user.password_reset_code;
				} else {
					login_link = login_link = hostname+"/login";
				}
				console.log("loginlink", login_link)
				var options = {
					to: user.email_address,
					from: admin.email_address,
					fromname: admin.first_name+" "+admin.last_name,
					subject: "Welcome to Social Tables",
					html: ejs.render(welcome_email, {'first_name': user.first_name, 'login_link': login_link, 'sales_name': admin.first_name+" "+admin.last_name, 'sales_email': admin.email_address})
				}
				sendgrid.send(new Email(options), function(success, err) {
				  if (!success) {
				    console.error(err);
				    res.send(500, "Email failed to send.")
				  }else{
				  	res.send(200, "OK");
				  }
				});
			}
		});

	});

	server.post('/user/:user/edit', function(req, res) {
		console.log("editing user", req.body);
		if(!req.body.is_venue){
			req.body.is_venue = 0;
		}
		if(!req.body.is_aim){
			req.body.is_aim = 0;
		}
		if(!req.body.trial){
			req.body.trial = 0;
		}
		if(req.body.trial_expires_at){
			req.body.trial_expires_at = new Date(req.body.trial_expires_at);
		}
		if(req.body.name){
			var i =  req.body.name.indexOf(" ");
			req.body.first_name = req.body.name.slice(0, i);
			req.body.last_name = req.body.name.slice(i+1);
			delete req.body.name;
		}
		var query = db.query("UPDATE users "
			+ "SET ? "
			+ "WHERE id = ?",
			[req.body, req.params.user],
			function(err, results) {
				if(err) {
					res.json(500, {error: err});
					console.error(err, query.sql)
				}
				else {
					res.redirect("/backend/?location=editUser&success=1");
				}
			});
		console.log("SQL: ", query.sql);
	});
	//responds with user information
	server.get('/user/:user/delete', function(req, res) {
		console.log("upgrading user");
		var query = db.query("DELETE FROM users WHERE id=?", [req.params.user], function(err, results) {
				if(err) {
					res.send(500, "Error, couldn't delete user.");
					console.error(err, query.sql)
				}
				else {
					res.send(200, "OK");
				}
			});
	});

	server.get('/user/:user/', function(req, res) {
		var query = db.query("SELECT * FROM users WHERE id=?", [req.params.user], function(err, results) {
				if(err) {
					res.send(500, "Error, couldn't delete user.");
					console.error(err, query.sql)
				}
				else {
					res.json(200, results[0]);
				}
			});
	});

	server.get('/user/:user/avg_objects', function(req, res) {
		db.query("SELECT id FROM events WHERE user_id=? AND is_archived=0",
			[req.params.user],
			function(err, event_id_obj) {
				if(err) {
					res.json(500, {error: err});
					console.error("ERROR IN 1", err)
				}
				else {
					var defer1 = when.defer();
					var defer2 = when.defer();
					var event_ids = []
					for(var i=0; i<event_id_obj.length; i++){
						event_ids[i] = event_id_obj[i].id;
					}
					console.log("EVENT IDS", event_ids)
					if(event_ids.length > 0){
						db.query("SELECT count(id) FROM event_tables WHERE event_id IN (?)",
							[event_ids],
							function(err, result) {
								if(err) {
									res.json(500, {error: err});
									console.error("ERROR IN 2", err);
								}
								else {
									console.log("NUMBER OF TABLES", result)
									defer1.resolve(result)
								}
							});
						db.query("SELECT count(id) FROM event_objects WHERE event_id IN (?)",
							[event_ids],
							function(err, result) {
								if(err) {
									res.json(500, {error: err});
									console.error("ERROR IN 3", err);
								}
								else {
									console.log("NUMBER OF OBJECTS", result)
									defer2.resolve(result)
								}
							});
						when.all([defer1.promise, defer2.promise]).then(function(result){
							console.log("FINAL RESULT", "(", result[0][0]['count(id)'], "+", result[1][0]['count(id)'], ") /", event_ids.length);
							res.json(200, {
								tables: result[0][0]['count(id)'],
								objects: result[1][0]['count(id)'],
								total: result[0][0]['count(id)']+result[1][0]['count(id)'],
								events: event_ids.length,
								average: (result[0][0]['count(id)']+result[1][0]['count(id)'])/event_ids.length
							});
						}, function(err){
							console.error("ERROR", err);
						})
					}else{
						console.error("User doesn't have any events");
						res.send(200, "N/A");
					}
				}
			});
	});

	server.post('/user/new', function(req, res) {
		console.log("REQUEST MADE");
		var admin = req.user;
		req.body.funnyCode = "Verbarhelichrysum-Corrodible-Grog-Mandioc-Zuisin";
		if(!req.body.is_venue){
			req.body.is_venue = 0;
		}
		if(!req.body.is_aim){
			req.body.is_aim = 0;
		}
		if(!req.body.trial){
			req.body.trial = 0;
		}
		if(req.body.trial_expires_at){
			req.body.trial_expires_at = new Date(req.body.trial_expires_at);
		}
		req.body.signupSource = "/backend/newUser.html";
		request.post({
			    url: hostname+'/api/users/create',
			    form: req.body
			},
		    function (error, response, body) {
		    	console.log("RESPONSE", error, response, body)
		    	body = JSON.parse(body);
		    	console.log("Data",  body.data);
		        console.log(body.data, "=?", "EMAIL_EXISTS")
		        if (response.statusCode == 200) {
		            	console.log("Sending welcome email", body.data);
		            	user = body.data;
						var login_link = hostname+"/users/"+user.id+"/reset-password?token="+user.password_reset_code;
						console.log("loginlink", login_link)
						var options = {
							to: user.email_address,
							from: admin.email_address,
							fromname: admin.first_name+" "+admin.last_name,
							subject: "Welcome to Social Tables",
							html: ejs.render(welcome_email, {'first_name': user.first_name, 'login_link': login_link, 'sales_name': admin.first_name+" "+admin.last_name, 'sales_email': admin.email_address})
						}
						sendgrid.send(new Email(options), function(success, err) {
						  if (!success) {
						    console.log(err);
						  }else{
						  	console.log("!")
						  }
						});
		        	console.log("SUCCESS")
		            res.redirect("/backend/?location=newUser&success=1")
		        } else if(body.data=="EMAIL_EXISTS") {
		        	console.log(body.data, "=?", "EMAIL_EXISTS")
		        	console.error("User already exists");
		        	res.redirect("/backend/?location=newUser&success=0&error=userExists")
		        } else if(body.data=="MISSING REQUIRED FIELDS"){
		        	console.log("Missing fields");
		        	res.redirect("/backend/?location=newUser&success=0&error=missingFields")
		        } else {
		        	console.error("ERROR", body.err, body.data )
		        	res.redirect("/backend/?location=newUser&success=0")
		        }
		    }
		);
	});

}