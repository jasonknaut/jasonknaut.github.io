/**
  * SLIDEVIZ
  * A lightweight module built to support an interactive slideshow
  * with distinct scenes.
  *
  * @author Jason Knaut
  *
 **/

var slideviz = {
  "_navcontrols": ["left-nav","right-nav","slide-nav"]
};

/** Create slide relationships from HTML **/
slideviz.setup = function() {
  var slides = {};
  var slide_elements = document.getElementsByClassName('slide-contents');

  // Set the current slide
  slideviz._current = slide_elements[0].id;

  // Create relationships between slides and UI elements
  for (var i=0; i < slide_elements.length; i++) {
    var e = slide_elements[i];
    slides[e.id] = {
                     "pos": i + 1,
                     "next_slide": e.dataset.next,
                     "prev_slide": e.dataset.prev,
                     "btn_id": slideviz._getButtonForSlide(e.id)
                   };
  }
  slideviz.slides = slides;

  // Attach methods to the UI controls
  slideviz._setListeners()

};

/** Show all slide navigation controls **/
slideviz.showNav = function() {
  for(var i=0; i < slideviz._navcontrols.length; i++) {
    document.getElementById(slideviz._navcontrols[i]).className = "visible";
  }
};

/** Hide all slide navigation controls **/
slideviz.hideNav = function() {
  for(var i=0; i < slideviz._navcontrols.length; i++) {
    document.getElementById(slideviz._navcontrols[i]).className = "hidden";
  }
};

/** ------ HELPER FUNCTIONS ----- **/

/** Attach event listeners to UI controls **/
slideviz._setListeners = function() {
  var startBtn = document.getElementById("start-btn");
  if (startBtn != undefined) {
    startBtn.addEventListener("click", function() {slideviz.showNav()});
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
