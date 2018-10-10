'use strict';

(function () {
  var initSLider = function () {
    var LEFT = 'left';
    var RIGHT = 'right';
    var rangeSliderHandler = document.querySelector('.range__filter');
    var fillLine = rangeSliderHandler.querySelector('.range__fill-line');
    var toggle = rangeSliderHandler.querySelector('.range__btn');
    var toggleWidth = toggle.offsetWidth;

    var Toggler = {};
    Toggler[LEFT] = rangeSliderHandler.querySelector('.range__btn--left');
    Toggler[RIGHT] = rangeSliderHandler.querySelector('.range__btn--right');

    var Price = {};
    Price[LEFT] = document.querySelector('.range__price--min');
    Price[RIGHT] = document.querySelector('.range__price--max');

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

    // устанавливает начальные значения ползунков
    var settingInitPrices = function () {
      Price[LEFT].textContent = slider.minPin;
      Price[RIGHT].textContent = slider.maxPin;
    };
    settingInitPrices();

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

        // вычисляет текущие значения позиций тогглов
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
        window.slider.calcCurrentMinMaxPos = calcCurrentMinMaxPos;
      };


      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        // обновляет каталог товаров в зависимости от выбранных фильтров
        var updateCatalog = function () {
          window.slider.initialMinPin = window.slider.calcCurrentMinMaxPos()[0];
          window.slider.initialMaxPin = window.slider.calcCurrentMinMaxPos()[1];

          window.filter.runtimeCards = window.filter.filterByPrice(window.slider.initialMinPin, window.slider.initialMaxPin);
          window.catalog.addCardElems(window.filter.runtimeCards);
          window.catalog.displayEmptyFilterStub(window.filter.runtimeCards);
          window.filter.updatePriceCounter(window.filter.runtimeCards);
        };

        updateCatalog();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    window.slider.initialMinPin = slider.minPin;
    window.slider.initialMaxPin = slider.maxPin;
  };

  window.slider = {
    initSLider: initSLider
  };
})();
