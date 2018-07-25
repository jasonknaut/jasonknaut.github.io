/**
  * SLIDEVIZ
  * A lightweight module built to support an interactive slideshow
  * with distinct scenes.
  *
  * @author Jason Knaut
  *
 **/

var slideviz = {};

/** Create slide relationships from HTML **/
slideviz.setup = function() {
  var slides = {};
  var slide_elements = document.getElementsByClassName('slide-contents');

  // Create relationships between slides and UI elements
  slideviz._current = slide_elements[0].id;   // Set current slide
  for (var i=0; i < slide_elements.length; i++) {
    var e = slide_elements[i];
    slides[e.id] = {
                     "pos": i,
                     "next": e.dataset.next,
                     "prev": e.dataset.prev,
                     "btn": slideviz._getButtonForSlide(e.id),
                     "hide_nav": e.dataset.hidenav
                   };
    if (e.dataset.initial != undefined) {
      slideviz._current = e.id;
    }
  }
  slideviz._slides = slides;

  slideviz._setListeners();    // Attach methods to the UI controls

};

/** nextSlide -- Advance to the next slide **/
slideviz.nextSlide = function() {
  slideviz._slideout(slideviz._current,"left");
  slideviz._current = slideviz._slides[slideviz._current].next;
  slideviz._slidein(slideviz._current);
  slideviz.refreshNav();
};

/** prevSlide -- Go back to the previous slide **/
slideviz.prevSlide = function() {
  slideviz._slideout(slideviz._current,"right");
  slideviz._current = slideviz._slides[slideviz._current].prev;
  slideviz._slidein(slideviz._current);
  slideviz.refreshNav();
};

/** goToSlide -- Go to a specific slide (may be forward or backward) **/
slideviz.goToSlide = function(slide_id) {

}

/** Show all slide navigation controls **/
slideviz.refreshNav = function() {
  s = slideviz._slides[slideviz._current]

  //if (s.hide_nav != undefined) {
  //  slideviz.hideNav();
  //  return;
  //}
  if (s.next) {
    slideviz.displayNextNav(true);
  }

  if (s.prev) {
    slideviz.displayPrevNav(true);
  }

  if (s.btn) {
    slideviz.displaySlideNav(true);
  }

};

/** Hide all slide navigation controls **/
slideviz.hideNav = function() {
  slideviz.displayPrevNav(false);
  slideviz.displayNextNav(false);
  slideviz.displaySlideNav(false);
};

slideviz.displayPrevNav = function(show) {
  document.getElementById("left-nav").className = show ? "visible" : "hidden";
};

slideviz.displayNextNav = function(show) {
  document.getElementById("right-nav").className = show ? "visible" : "hidden";
};

slideviz.displaySlideNav = function(show) {
  document.getElementById("slide-nav").className = show ? "visible" : "hidden";
};

/** ------ HELPER FUNCTIONS ----- **/

/** Attach event listeners to UI controls **/
slideviz._setListeners = function() {
  btn_actions = {
    "start-btn": slideviz.nextSlide,
    "slide-prev-btn": slideviz.prevSlide,
    "slide-next-btn": slideviz.nextSlide,
    "about-btn": function() { slideviz.goToSlide('slide-about')}
  }

  for(var btn in btn_actions) {
    if (btn_actions.hasOwnProperty(btn)) {
      e = document.getElementById(btn);
      if (e) {
        e.addEventListener("click", btn_actions[btn]);
      }
    }
  }

};

/** Find the nav button element associated with a slide **/
slideviz._getButtonForSlide = function(slideId) {
  var elements = document.getElementsByClassName('slide-btn');

  for (var i=0; i < elements.length; i++) {
    if (elements[i].dataset.linkedto == slideId)
      return elements[i].id;
  }

  return;
};

slideviz._slideout = function(slide_id, direction) {
  document.getElementById(slide_id).className = 'slide-contents offscreen ' + direction.toLowerCase();
}

slideviz._slidein = function(slide_id) {
  document.getElementById(slide_id).className = 'slide-contents';
}
