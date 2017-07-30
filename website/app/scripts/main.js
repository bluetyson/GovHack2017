

var didScroll
var lastScrollTop = 0
var delta = 5
var navbarHeight = $('.donate-bar').outerHeight()
var windowH = $(window).height();

$(window).scroll(function (event) {
  didScroll = true
})

setInterval(function () {
  if (didScroll) {
    hasScrolled()
    didScroll = false
  }
}, 250)

function hasScrolled () {
  var st = $(window).scrollTop()
  //console.log("st: "+st+", lastScrollTop: "+lastScrollTop);
  if (Math.abs(lastScrollTop - st) <= delta) return
  if (st > windowH+navbarHeight) {
    //console.log("windowH: "+windowH);
    $('html').removeClass('nav-hidden-home');
  } else {
    $('html').addClass('nav-hidden-home');
  }
  if (st > lastScrollTop && st > navbarHeight) {
    // Scroll Down
    $('html').removeClass('nav-visible');
    //$('.donate-bar').removeClass('nav-down').addClass('nav-up');
  } else {
    // Scroll Up
    if (st + $(window).height() < $(document).height() && lastScrollTop > 110) {
      $('html').addClass('nav-visible');
      //$('.donate-bar').removeClass('nav-up').addClass('nav-down');
    }
  }
  lastScrollTop = st
}

$('#hamburger,#hamburger-mob').on('click',function(){
  $(this).toggleClass('is-active');
  $('html').toggleClass('narrow');
});
