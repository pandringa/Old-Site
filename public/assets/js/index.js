//START FB INIT
var permissionsFB = "create_note,email,export_stream,friends_about_me,friends_actions.books,friends_actions.music,friends_actions.news,friends_actions.video,friends_activities,friends_birthday,friends_education_history,friends_events,friends_games_activity,friends_groups,friends_hometown,friends_interests,friends_likes,friends_location,friends_notes,friends_online_presence,friends_photo_video_tags,friends_photos,friends_questions,friends_relationship_details,friends_relationships,friends_religion_politics,friends_status,friends_subscriptions,friends_videos,friends_website,friends_work_history,manage_friendlists,manage_notifications,photo_upload,publish_actions,publish_stream,read_friendlists,read_insights,read_mailbox,read_page_mailboxes,read_requests,read_stream,share_item,sms,status_update,user_about_me,user_actions.books,user_actions.music,user_actions.news,user_actions.video,user_activities,user_birthday,user_education_history,user_events,user_games_activity,user_groups,user_hometown,user_interests,user_likes,user_location,user_notes,user_online_presence,user_photo_video_tags,user_photos,user_questions,user_relationship_details,user_relationships,user_religion_politics,user_status,user_subscriptions,user_videos,user_website,user_work_history,video_upload"
    


FB.init({
    appId      : '684142398269025',                        // App ID from the app dashboard
    status     : true,                                 // Check Facebook Login status
    xfbml      : false                                  // Look for social plugins on the page
});

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};
String.prototype.remove = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + this.substring(index+string.length, this.length);
  else
    return this.substring(string.length, this.length);
};




var ViewModel = function(){
	var self = this;
	this.message = "Hello!"
	this.services = ["Facebook", "Twitter"]
	this.loggedInTwitter = ko.observable(false);
	this.loggedInFB = ko.observable(false);
	this.fbLoggedInText = ko.observable("");
	FB.getLoginStatus(function(response) {
	  if (response.status === 'connected') {
	    var uid = response.authResponse.userID;
	    var accessToken = response.authResponse.accessToken;
	    self.fbToken = accessToken;
	    self.loggedInFB(true)
	    console.log("User is already logged in", response);
	    $.get("/fb/"+uid+"/token", function(data){
	    	console.log("FIrst get", data)
	    	if(data.expired){
	    		console.log("Data expired")
	    		$.post("/fb/newToken", {token: self.fbToken}, function(data){
	    			console.log("First post", data)
	    			self.longFbToken = data.token;
	    			self.longTokenExpires = data.expires;
	    			var date = new Date(data.expires * 1000)
	    			self.fbLoggedInText("Logged in to Facebook, expires on "+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear())
	    		})
	    	}else{
	    		console.log("Data not expired")
	    		self.longFbToken = data.token;
	    		self.longTokenExpires = data.expires;
	    		console.log("data.expires", data.expires)
	    		var date = new Date(data.expires * 1000)
	    		self.fbLoggedInText("Facebook expires on "+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear())
	    	}
	    })
	  }
	 });
	var ledCount = 1
	self.methods = {
		"Facebook": ["Notification", "Online Presence", "Message", "Friend Request"],
		"Twitter": ["Mention", "New Follower"]
	}
	this.over = function(model, evt){
		var src = evt.target.src;
		var i = src.indexOf(".");
		src = src.insert(i, "-over");
		evt.target.src = src;
	}
	this.out = function(model, evt){
		var src = evt.target.src;
		var i = src.indexOf("-over")
		src = src.remove(i, "-over");
		evt.target.src = src;
	}
	this.loginFB = function(evt){
		console.log("logging in");
		 FB.login(function(response) {
		   if (response.authResponse) {
		     console.log('Welcome!  Fetching your information.... ');
		     console.log("Right now we have ", response)
		     FB.api('/me', function(response) {
		       console.log('Good to see you, ' + response.name + '.');
		     });
		   } else {
		     console.log('User cancelled login or did not fully authorize.');
		   }
		 }, {scope: permissionsFB});
	}
	this.loginTwitter = function(evt){
		console.log("logging in to twitter")
	}
	this.data = ko.observable([]);
	this.LED = function(data){
		var led = this;
		this.name = ko.observable("LED "+ledCount);
		ledCount++;
		this.color = ko.observable("#000000");
		this.currService = ko.observable("Facebook");
		this.currOptions = ko.computed(function() {
        	return self.methods[led.currService()];
    	});
		this.currMethod = ko.observable("Notification");
		this.target = ko.observable("");
	}
	this.sqlData = [{id:0},{id:1},{id:2},{id:3}]
		for(var i=0; i<4; i++){
			self.data().push(new self.LED(self.sqlData[i]))
		}
}
$(function() {
    //$("input[type=submit]").button();
  });
var model = new ViewModel();
ko.applyBindings(model)