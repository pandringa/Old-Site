var ejs = require('ejs')
var request = require("request")

module.exports = function(server, db) {

	server.get("/fb/:user_id/token", function(req, res){
		db.query("SELECT facebook_token as token, facebook_expires as expires FROM users WHERE id=1", [], function(err, data){ //DONT HARDCODE ID 
			console.log("query", data)
			var now = new Date();
			var expiresDate = new Date(data[0].expires * 1000);
			if(expiresDate - now <= 0){
				console.log("Token expired")
				res.json({expired: true, token: -1, expires: -1})
			}else{
				console.log("Token fine")
				res.json({expired: false, token: data[0].token, expires: data[0].expires})
			}
		});
	})

	server.post("/fb/newToken", function(req, res){
		console.log("Post made", req);
		request('https://graph.facebook.com/oauth/access_token?'+ 
				    'grant_type=fb_exchange_token&' +           
				    'client_id=684142398269025&' +
				    'client_secret=f60a03408a2778f6a1b1e0e48212dfac&' +
				    'fb_exchange_token='+req.body.token,
			function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			  	console.log("SUCCESS")
			    console.log(body)
			    body = body.split("&")
			   	var token = body[0].split("=")[1]
			    var expires = body[1].split("=")[1]

			    var now = Math.floor(new Date().getTime() / 1000);
			    var time = parseInt(expires)+parseInt(now);
			    console.log("now", now)
			    console.log("expires", expires)
			    console.log("time", time);
			    console.log("token", token)
			    db.query("UPDATE users SET facebook_token=?, facebook_expires=? WHERE id=1", [token, time], function(err, data){
			    	console.log("Updated token successfully", err)
			    	res.json({expires: time, token: token});
			    })
			  }
		})
	});
}

