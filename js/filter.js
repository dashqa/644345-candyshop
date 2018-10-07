'use strict';

(function () {

  var sortType = 'none';

  var GoodKind = {
    'Мороженое': 'icecream',
    'Газировка': 'soda',
    'Жевательная резинка': 'gum',
    'Мармелад': 'marmalade',
    'Зефир': 'marshmallow'
  };

  var updateCatalog = function () {
    var typeFilteredCards = window.catalog.goods.slice();
    var filteredCards = typeFilteredCards;
    var propertyFilteredCards = typeFilteredCards;

    // возвращает массив с объектами, которые имеют конкретный тип
    var filterByType = function (kinds) {
      if (!kinds.length) {
        typeFilteredCards = window.catalog.goods;
      }
      typeFilteredCards = window.catalog.goods.filter(function (good) {
        return kinds.indexOf(GoodKind[good.kind]) !== -1;
      });
    };

    var filterByProperty = function (facts) {
      if (!facts.length) {
        propertyFilteredCards = typeFilteredCards;
      }
      propertyFilteredCards = typeFilteredCards.filter(function (good) {
        return facts.some(function (fact) {
          switch (fact) {
            case 'sugar-free':
              return !good.nutritionFacts.sugar;
            case 'vegetarian':
              return good.nutritionFacts.vegetarian;
            case 'gluten-free':
              return !good.nutritionFacts.gluten;
            default:
              return false;
          }
        });
      });
    };

    var filterByMark = function (marks) {
      return propertyFilteredCards.filter(function (good) {
        return marks.every(function (mark) {
          switch (mark) {
            case 'favorite':
              return good.favorite;
            case 'availability':
              return good.amount > 0;
            default:
              return false;
          }
        });
      });
    };

    var sortByRating = function (key) {
      filteredCards.sort(function (first, second) {
        return second.rating[key] - first.rating[key];
      });
    };

    var sortBy = function (type) {
      switch (type) {
        case 'popular':
          return sortByRating('number');
        case 'rating':
          return sortByRating('value');
        case 'expensive':
          return sortByPrice();
        case 'cheep':
          return sortByPrice(true);
        default:
          return false;
      }
    };

    // возвращает массив с объектами, отсортированные по цене
    var sortByPrice = function (isByMin) {
      return filteredCards.sort(function (first, second) {
        return isByMin ? first.price - second.price : second.price - first.price;
      });
    };

    var getCheckedValues = function (children) {
      return Array.from(children).reduce(function (accum, cur) {
        if (cur.checked) {
          accum.push(cur.value);
        }
        return accum;
      }, []);
    };

    var SideBarMap = {
      'food-type': filterByType,
      'food-property': filterByProperty,
      'mark': filterByMark
    };

    var catalogSidebarElem = document.querySelector('.catalog__sidebar');
    catalogSidebarElem.addEventListener('change', function (evt) {
      var name = evt.target.name;
      var counter = evt.target.parentElement.querySelector('.input-btn__item-count');
      switch (name) {
        case 'food-type':
        case 'food-property':
        case 'mark':
          filteredCards = SideBarMap[name](getCheckedValues(document.querySelectorAll('input[name="' + name + '"]')));
          break;

        case 'sort':
          sortType = evt.target.value;
          break;
      }

      sortBy(sortType);

      if (counter) {
        // counter.textContent = '(' + filteredCards.length + ')';
      }
      window.catalog.addCardElems(filteredCards);
    });
  };

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

  // поиск мин и макс значения цены
  var findMinAndMaxPrice = function (isMax) {
    var prices = window.catalog.goods.map(function (good) {
      return good.price;
    });
    var pricesCopy = prices.slice();
    pricesCopy.sort(function (first, second) {
      return first - second;
    });

    return isMax ? pricesCopy.pop() : pricesCopy.shift();
  };

  rangeSliderHandler.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var slider = {
      startPos: 0,
      endPos: rangeSliderHandler.offsetWidth - toggleCenter,
      minPin: findMinAndMaxPrice(window.catalog.goods, false),
      maxPin: findMinAndMaxPrice(window.catalog.goods, true)
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

  window.filter = {
    updateCatalog: updateCatalog
  };
})();
