 console.log("hi");
      function parallax(){
        var scrolled = $(window).scrollTop();
        $('.bg').css('top', -(scrolled * 0.8) + 'px');
      }
      $(window).scroll(function(e){
          parallax();
          console.log("p");
      });