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

  slide_pos = slideviz._slides[slide_id].pos;
  slide_ids = slideviz._getSlideIds();

  for (var i=0; i < slide_ids.length; i++) {
    idx = slide_ids[i];
    pos = slideviz._slides[idx].pos;
    if (pos < slide_pos) {
      s_class = "slide-contents offscreen left";
    } else if (pos > slide_pos) {
      s_class = "slide-contents offscreen right";
    } else {
      s_class = "slide-contents";
    }
    document.getElementById(idx).className = s_class;
  }

  slideviz._current = slide_id;
  slideviz.refreshNav();

}

/** Show all slide navigation controls **/
slideviz.refreshNav = function() {
  s = slideviz._slides[slideviz._current]

  if (s.hide_nav != undefined) {
    slideviz.hideNav();
    return;
  }

  has_next = (s.next != undefined);
  has_prev = (s.prev != undefined);
  has_selector = (s.btn != undefined);

  slideviz.displayNextNav(has_next);
  slideviz.displayPrevNav(has_prev);
  slideviz.displaySlideNav(has_selector);

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
  slide_ids = slideviz._getSlideIds();
  for (var i=0; i < slide_ids.length; i++) {
    sid = slide_ids[i];
    s_btn = slideviz._slides[sid].btn;

    if (s_btn != undefined) {
      document.getElementById(s_btn).className = (sid == slideviz._current) ? "slide-btn selected" : "slide-btn";
    }
  }

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

  var btns = document.getElementsByClassName('slide-btn');
  for (var i=0; i < btns.length; i++) {
    if (btns[i].dataset.linkedto != undefined) {
      btns[i].addEventListener("click", function() { slideviz.goToSlide(this.dataset.linkedto); });
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

slideviz._getSlideIds = function() {
  slide_ids = [];
  for(var s in slideviz._slides) {
    if (slideviz._slides.hasOwnProperty(s)) {
      slide_ids.push(s);
    }
  }

  return slide_ids;
}

slideviz._slideout = function(slide_id, direction) {
  document.getElementById(slide_id).className = 'slide-contents offscreen ' + direction.toLowerCase();
}

slideviz._slidein = function(slide_id) {
  document.getElementById(slide_id).className = 'slide-contents';
}
