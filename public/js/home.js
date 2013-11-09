function enterAbout(){
	console.log("Fly in about here")
}
function enterResume(){
	console.log("fly in resume here")
}
function enterProjects(){
	console.log("fly in projects here")
}
function enterBlog(){
	console.log("fly in blog here")
}
function enterContact(){
	console.log("nothing contact-y here")
}
var sections = [
	{color: '#55A', id: '#head', name: 'head', entered: true, enter: function(){return;} },
	{color: '#5A5', id: '#about', name: 'about', entered: false, enter: function(){if(!this.entered) enterAbout();} },
	{color: '#A55', id: '#resume', name: 'resume', entered: false, enter: function(){if(!this.entered) enterResume();} },
	{color: '#A5A', id: '#projects', name: 'projects', entered: false, enter: function(){if(!this.entered) enterProjects();} },
	{color: '#5AA', id: '#blog', name: 'blog', entered: false, enter: function(){if(!this.entered) enterBlog();} },
	{color: null, id: '#contact', name: 'contact', entered: false, enter: function(){if(!this.entered) enterContact();} }
]
for(var i=0; i<sections.length; i++){
	var sec = sections[i];
	sec.top = $(sec.id).offset().top;
}


//Scrolling animations
var scrollDuration = 2000;
$(document).ready(function() {
   $('#head').localScroll({duration:scrollDuration});
   $('#about').localScroll({duration:scrollDuration*2});
   $('#resume').localScroll({duration:scrollDuration*3});
   $('#projects').localScroll({duration:scrollDuration*4});
   $('#blog').localScroll({duration:scrollDuration*5});
   $('#contact').localScroll({duration:scrollDuration*5});
});
//Variable holds current location
var idIndex = document.URL.indexOf("#");
var currLocation;
if(idIndex == -1)
	currLocation = 'head';
else
	currLocation = document.URL.substring(idIndex);
console.log(idIndex, currLocation);

function changeLocation(section){
	console.log("Changing location to", section.name);
	currLocation = section.name;
	if(section.color != null)
		$('#background').transition({'background': section.color});
	section.enter();
	section.entered = true;
}
//Scroll detection for the stuff
$(window).scroll(function(){
	var screenCenter = ($(this).height()/1.5) + $(this).scrollTop();
	for(var i=sections.length-1; i>=0; i--){
		var sec = sections[i];
    	if(sec.top < screenCenter){
    		if(sec.name != currLocation)
    			changeLocation(sec);
    		break;
    	}
    }
});
