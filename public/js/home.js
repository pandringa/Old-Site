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
		}, 800*index);
	})
}
function enterProjects(){
	console.log("fly in projects here");
	var count = 0;
	$(".projectPanel").each(function( index ){
		var self = this;
		console.log("num", count);
		var waitTime = 0;
		if($(self).hasClass("projectPanel-left-center"))
			waitTime = 0;
		else if($(self).hasClass("projectPanel-right-center"))
			waitTime = 300;
		else if($(self).hasClass("projectPanel-left"))
			waitTime = 500;
		else if($(self).hasClass("projectPanel-right"))
			waitTime = 600;
		waitTime += 1000*(count / 4);
		setTimeout(function(){
			$(self).transition({'display': 'block'}, 100).transition({'left': "0px"}, 1500);
		}, waitTime);
		count++;
	})
}
function enterBlog(){
	console.log("fly in blog here");
	var count = $('.blogPreview').length;
	$(".blogPreview").each(function( index ){
		var self = this;
		setTimeout(function(){
			$(self).transition({'opacity': '1.0'}, 100).transition({'top': "0px"}, 1200);
		}, 800*(count-index-1));
	});
	setTimeout(function(){
			$('#viewMore').transition({'opacity': '1.0'}, 2500);
		}, (500*count)+1000);

}
function enterContact(){
	console.log("nothing contact-y here")
}
var palettes = [
	['#06A2CB', '#218559', '#EBB035', '#DD1E2F', '#D0C6B1'],
	['#3D4C53', '#70B7BA', '#F7E967', '#F1433F', '#A9CF54'],
	['#425C81', '#5EA032', '#D59859', '#620C67', '#D3D1D2'],
	['#656E75', '#679EC9', '#F1921A', '#669900', '#E6E7E8'],
]
var color = palettes[2];
var sections = [
	{color: color[0], id: '#head', name: 'head', entered: true, enter: function(){return;} },
	{color: color[1], id: '#about', name: 'about', entered: false, enter: function(){if(!this.entered) enterAbout();} },
	{color: color[2], id: '#resume', name: 'resume', entered: false, enter: function(){if(!this.entered) enterResume();} },
	{color: color[3], id: '#projects', name: 'projects', entered: false, enter: function(){if(!this.entered) enterProjects();} },
	{color: color[4], id: '#blog', name: 'blog', entered: false, enter: function(){if(!this.entered) enterBlog();} },
	{color: null, id: '#contact', name: 'contact', entered: false, enter: function(){if(!this.entered) enterContact();} }
]
function calculateTops(){
	console.log("calculating tops");
	for(var i=0; i<sections.length; i++){
		var sec = sections[i];
		sec.top = $(sec.id).offset().top;
	}
}
calculateTops();

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
   $('#toTop').localScroll({duration:scrollDuration});

   $('#fixedNav i').hover(
		function(){
			$(this).removeClass('fa-circle-o'); $(this).addClass('fa-dot-circle-o');
			$(this).next().css("display", 'inline')
		},function(){ 
			$(this).removeClass('fa-dot-circle-o'); $(this).addClass('fa-circle-o');
			$(this).next().css("display", 'none')
		}
    )

   if(window.innerWidth < 1200){//Bootstrap grid is two objects/row
   		var panelNum = 0;
   		$(".projectPanel").each(function( index ){
			var self = this;
			$(self).data('index', panelNum); //TODO fix this
			switch(panelNum%2){
				case 0:
					$(self).addClass("projectPanel-left");
					break;
				case 1:
					$(self).addClass("projectPanel-right");
					break;
			}
			panelNum++;
		});
	}else{
		var panelNum = 0;
		$(".projectPanel").each(function( index ){
			var self = this;
			switch(panelNum%4){
				case 0:
					$(self).addClass("projectPanel-left");
					break;
				case 1:
					$(self).addClass("projectPanel-left-center");
					break;
				case 2:
					$(self).addClass("projectPanel-right-center");
					break;
				case 3:
					$(self).addClass("projectPanel-right");
					break;
			}
			panelNum++;
		});
	}
});

function changeLocation(section){
	console.log("Changing location to", section.name);
	// Hide/show fixed nav circles
	if(currLocation == 'head' && section.name != 'head')
		setTimeout(function(){$('#fixedNav').transition({'opacity': '1.0'}, 2000);$('#toTop').transition({'opacity': '1.0'}, 2000);}, 1000);
	else if(currLocation != 'head' && section.name == 'head'){
		$('#fixedNav').transition({'opacity': '0.0'}, 1000);
		$('#toTop').transition({'opacity': '0.0'}, 1000);
	}

	currLocation = section.name;
	if(section.color != null)
		$('#background').transition({'background': section.color});

	setTimeout(section.enter, 500);
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
$(window).resize(function(){
	calculateTops();
})
