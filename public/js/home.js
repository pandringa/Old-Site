/* ----------------------- MODEL ----------------------- */
function enterAbout(){
	console.log("Fly in about here");
	$('#aboutText').transition({'display': 'block'}, 100).transition({'left': "0px"}, 1500);
	$('#aboutImage').transition({'display': 'block'}, 100).transition({'left': "0px"}, 1500);
}
function enterResume(){
	console.log("fly in resume here")
	$(".resumeSection").each(function( index ){
		var self = this;
		setTimeout(function(){
			$(self).transition({'opacity': '1.0'}, 1300, 'ease');
		}, 1000*index);
	})
}
function enterProjects(){
	console.log("fly in projects here");
}
function enterBlog(){
	console.log("fly in blog here")
}
function enterContact(){
	console.log("nothing contact-y here")
}
var sections = [
	{color: '#ACACAC', id: '#head', name: 'head', entered: true, enter: function(){return;} },
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

//Variable holds current location (based off url)
var idIndex = document.URL.indexOf("#");
var currLocation;
if(idIndex == -1)
	currLocation = 'head';
else
	currLocation = document.URL.substring(idIndex);

/* ----------------------- CONTROLLER ----------------------- */

//Scrolling animations
var scrollDuration = 2000;
$(document).ready(function() {
   $('#nav').localScroll({duration:scrollDuration});
   $('#fixedNav').localScroll({duration:scrollDuration});

   $('#fixedNav i').hover(
		function(){$(this).removeClass('fa-circle-o'); $(this).addClass('fa-dot-circle-o'); $(this).next().css("display", 'inline')},
    	function(){ $(this).removeClass('fa-dot-circle-o'); $(this).addClass('fa-circle-o'); $(this).next().css("display", 'none')}
    )
});

function changeLocation(section){
	console.log("Changing location to", section.name);
	// Hide/show fixed nav circles
	if(currLocation == 'head' && section.name != 'head')
		setTimeout(function(){$('#fixedNav').transition({'opacity': '1.0'}, 2000);}, 1000);
	else if(currLocation != 'head' && section.name == 'head')
		$('#fixedNav').transition({'opacity': '0.0'}, 1000);

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
