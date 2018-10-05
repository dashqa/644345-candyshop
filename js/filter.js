'use strict';

(function () {

  // var findMinPrice = function (array) {
  //   var pricesArray = [];

  //   array.price.sort(function ())
  // };
  // ползунок фильтра по цене
  var LEFT = 'left';
  var RIGHT = 'right';
  var rangeSliderHandler = document.querySelector('.range__filter');
  var fillLine = rangeSliderHandler.querySelector('.range__fill-line');
  var toggle = rangeSliderHandler.querySelector('.range__btn');

  var Toggler = {};
  Toggler[LEFT] = rangeSliderHandler.querySelector('.range__btn--left');
  Toggler[RIGHT] = rangeSliderHandler.querySelector('.range__btn--right');

  var Price = {};
  Price[LEFT] = document.querySelector('.range__price--min');
  Price[RIGHT] = document.querySelector('.range__price--max');
  var toggleCenter = toggle.offsetWidth / 2;


  rangeSliderHandler.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var slider = {
      startPos: 0,
      endPos: rangeSliderHandler.offsetWidth - toggleCenter,
      minPin: 0,
      maxPin: 500
    };

    var startXCoords = evt.clientX;

    var onMouseMove = function (moveEvt) {
      var shift = startXCoords - moveEvt.clientX;
      startXCoords = moveEvt.clientX;

      switch (evt.target) {
        case Toggler[LEFT]:
          return moveToggler(LEFT, slider.startPos, Toggler[RIGHT].offsetLeft, shift);
        case Toggler[RIGHT]:
          return moveToggler(RIGHT, Toggler[LEFT].offsetLeft, slider.endPos, shift);
      }
      return false;
    };

    var moveToggler = function (side, min, max, shift) {
      var newCoord = Toggler[side].offsetLeft - shift;
      if (newCoord >= min && newCoord <= max) {
        Toggler[side].style.left = newCoord + 'px';
        fillLine.style[side] = Math.abs(newCoord - (side === RIGHT ? slider.endPos : 0)) + 'px';
        Price[side].textContent = Math.round(newCoord / slider.endPos * slider.maxPin);
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
