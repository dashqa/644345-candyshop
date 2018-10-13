'use strict';

(function () {
  var initSLider = function () {
    var LEFT = 'left';
    var RIGHT = 'right';
    var rangeSliderHandler = document.querySelector('.range__filter');
    var fillLine = rangeSliderHandler.querySelector('.range__fill-line');
    var toggle = rangeSliderHandler.querySelector('.range__btn');
    var toggleWidth = toggle.offsetWidth;

    var toggler = {};
    toggler[LEFT] = rangeSliderHandler.querySelector('.range__btn--left');
    toggler[RIGHT] = rangeSliderHandler.querySelector('.range__btn--right');

    var price = {};
    price[LEFT] = document.querySelector('.range__price--min');
    price[RIGHT] = document.querySelector('.range__price--max');

    // поиск мин и макс значения цены из всего каталога
    var findMinAndMaxPrice = function (goods, isMax) {
      var prices = goods.map(function (good) {
        return good.price;
      }).sort(function (first, second) {
        return first - second;
      });

      return isMax ? prices.pop() : prices.shift();
    };

    var slider = {
      startPos: 0,
      endPos: rangeSliderHandler.offsetWidth - toggleWidth,
      minPin: findMinAndMaxPrice(window.catalog.goods),
      maxPin: findMinAndMaxPrice(window.catalog.goods, true)
    };

    price[LEFT].textContent = slider.minPin;
    price[RIGHT].textContent = slider.maxPin;

    var currentPrice = {
      min: price[LEFT].textContent,
      max: price[RIGHT].textContent
    };

    rangeSliderHandler.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      var startXCoords = evt.clientX;

      var onMouseMove = function (moveEvt) {
        var shift = startXCoords - moveEvt.clientX;
        startXCoords = moveEvt.clientX;

        switch (evt.target) {
          case toggler[LEFT]:
            return moveToggler(LEFT, slider.startPos, toggler[RIGHT].offsetLeft, shift);
          case toggler[RIGHT]:
            return moveToggler(RIGHT, toggler[LEFT].offsetLeft, slider.endPos, shift);
        }
        return false;
      };

      var moveToggler = function (side, min, max, shift) {
        var newCoord = toggler[side].offsetLeft - shift;

        if (newCoord >= min && newCoord <= max) {
          toggler[side].style.left = newCoord + 'px';
          fillLine.style[side] = Math.abs(newCoord - (side === RIGHT ? slider.endPos : 0)) + 'px';
          price[side].textContent = Math.round(newCoord / slider.endPos * slider.maxPin);
        }

        currentPrice.min = price[LEFT].textContent;
        currentPrice.max = price[RIGHT].textContent;
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        window.filter.render(currentPrice.min, currentPrice.max);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    window.slider.currentPrice = currentPrice;
  };

  window.slider = {
    initSLider: initSLider,
  };
})();
