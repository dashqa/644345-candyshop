'use strict';

(function () {

  var LEFT = 'left';
  var RIGHT = 'right';
  var rangeSliderHandler = document.querySelector('.range__filter');
  var fillLine = rangeSliderHandler.querySelector('.range__fill-line');
  var toggle = rangeSliderHandler.querySelector('.range__btn');
  var toggleCenter = toggle.offsetWidth / 2;

  var Toggler = {};
  Toggler[LEFT] = rangeSliderHandler.querySelector('.range__btn--left');
  Toggler[RIGHT] = rangeSliderHandler.querySelector('.range__btn--right');

  var Price = {};
  Price[LEFT] = document.querySelector('.range__price--min');
  Price[RIGHT] = document.querySelector('.range__price--max');

  var slider = {
    startPos: 0,
    endPos: rangeSliderHandler.offsetWidth - toggleCenter,
    minPin: 0,
    maxPin: 90
  };

  var settingInitPrices = function () {
    Price[LEFT].textContent = slider.minPin;
    Price[RIGHT].textContent = slider.maxPin;
  };
  settingInitPrices();

  // findMinAndMaxPrice(window.catalog.goods),
  // findMinAndMaxPrice(window.catalog.goods, true)

  // // поиск мин и макс значения цены из всего каталога
  // var findMinAndMaxPrice = function (goods, isMax) {
  //   var prices = goods.map(function (good) {
  //     return good.price;
  //   }).sort(function (first, second) {
  //     return first - second;
  //   });

  //   return isMax ? prices.pop() : prices.shift();
  // };
  rangeSliderHandler.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
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
        var currentPos = Math.round(newCoord / slider.endPos * slider.maxPin);
      }

      var calcCurrentMinMaxPos = function () {
        var currentMinPos = slider.minPin;
        var currentMaxPos = slider.maxPin;
        switch (evt.target) {
          case Toggler[LEFT]:
            currentMinPos = currentPos;
            return [currentMinPos, currentMaxPos];
          case Toggler[RIGHT]:
            currentMaxPos = currentPos;
            return [currentMinPos, currentMaxPos];
        }
        return false;
      };

      var filterByRangePrice = function (cards) {
        return cards.filter(function (card) {
          return card.price >= calcCurrentMinMaxPos()[0] && card.price <= calcCurrentMinMaxPos()[1];
        });
      };

      window.slider.filterByRangePrice = filterByRangePrice;
    };

    var isMouseUp = false;

    window.slider = {
      isMouseUp: isMouseUp
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.slider.isMouseUp = true;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

})();
