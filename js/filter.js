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

  /* фильтры по категории(тип):
  1. комбинируются между собой
  2. комбинируются с фильтрами по составку
  3. комбинируются с сортировкой
  4. если не выбран ни один фильтр (или отменен), то показывается изначальный список с сервера

  фильтры по составу (проперти):
  1. комбинируются между собой
  2. комбинируются с фильтрами по категории
  3. комбинируются с сортировкой
  4. если не выбран, то отменяет своё действие

  фильтры только избранное и в наличии (пометки)
  1. отменяют все остальные фильтры
  2. отменяют друг друга (одновременно показан только один фильтр) ==> не нужна функция получения checkedvalue
  3. комбинируются с сортировкой

  фильтр по цене
  1.  Нижняя и верхняя границы могут совпадать, в этом случае в список должны попадать только те товары,
   цена которых чётко соответствует указанной в фильтре.
  2. при изменении цены, меняется кол-во

  индикатор кол-ва
  1. есть начальные значения у всех пунктов
  2. при изменении фильтров категории и фильтров состава, у ЦЕНЫ должно меняться кол-во
  3. при смещении цены, у цены меняется кол-во
  4. при добавлении в избранное меняется кол-во
  5. "в наличие" всегда равно изначальному кол-ву товаров
  4. должно ли меняться кол-во при категория + состав? в ТЗ нет, но логично так сделать


  сначала популярные: товары в исходном порядке, в котором они были загружены с сервера;
  сначала дорогие;
  сначала дешёвые;
  по рейтингу: товары, расположенные в порядке убывания рейтинга.
  При совпадении рейтинга, выше показывается товар, у которого больше голосов в рейтинге.

   «Показать всё» сбрасывает все выбранные фильтры и показывает список в исходном состоянии.


   ВЫВОДЫ:
   1. нужна начальная настройка =  фильтры и сортировка сброшены, индикаторы кол-ва, ползунок цены на 0 - 90
   2. кобинируются между собой:

      категория + категория,
      категория + сортировка

      состав + состав,
      состав + сортировка

      категория + состав,
      категория + состав + сортировка

      избранное + сортировка
      в наличии + сортировка

    4. показать все, в наличии = показывают начальный список?
       по популярности запоминает позицию карточек от начальной выгрузки с сервера?
       по рейтингу комбинирует сортировку по голосам и звездочкам?
   */

  var setDefaultParams = function () {
    Array.from(document.querySelectorAll('input[name="food-type"], input[name="food-property"]')).forEach(function (elem) {
      elem.checked = false;
    });
  };

  var writeCounters = function (inputs) {
    Object.keys(inputs).forEach(function (key) {
      document.querySelector('#' + key + '-count').textContent = '(' + inputs[key] + ')';
    });
  };

  var updateMarkCounters = function (cards) {
    var foodMark = {
      'favorite': 0,
      'availability': 0
    };
    cards.forEach(function (card) {
      if (card.favorite === true) {
        foodMark['favorite'] += 1;
      }
      if (card.amount > 0) {
        foodMark['availability'] += 1;
      }
    });
    writeCounters(foodMark);
  };

  var updateCatalog = function () {

    // возвращает массив с объектами, которые имеют конкретный тип
    var filterByKind = function (cards, kinds) {
      if (!kinds.length) {
        return cards;
      }
      return cards.filter(function (good) {
        return kinds.indexOf(GoodKind[good.kind]) !== -1;
      });
    };

    var filterByNutritionFacts = function (cards, facts) {
      if (!facts.length) {
        return cards;
      }
      return cards.filter(function (good) {
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

    var filterByMark = function (mark) {
      setDefaultParams();
      return window.catalog.goods.filter(function (good) {
        switch (mark) {
          case 'favorite':
            document.querySelector('input[value="availability"]').checked = false;
            return good.favorite;
          case 'availability':
            document.querySelector('input[value="favorite"]').checked = false;
            return good.amount > 0;
          default:
            return false;
        }
      });
    };

    var sortByRating = function (cards) {
      cards.sort(function (first, second) {
        if (second.rating.value !== first.rating.value) {
          return second.rating.value - first.rating.value;
        }
        return second.rating.number - first.rating.number;
      });
    };

    var sortBy = function (cards, type) {
      switch (type) {
        case 'popular':
          return cards;
        case 'rating':
          return sortByRating(cards, 'value');
        case 'expensive':
          return sortByPrice(cards);
        case 'cheep':
          return sortByPrice(cards, true);
        default:
          return false;
      }
    };

    // возвращает массив с объектами, отсортированные по цене
    var sortByPrice = function (cards, isByMin) {
      return cards.sort(function (first, second) {
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

    var updateTypeCounters = function (cards) {
      var foodType = {
        'icecream': 0,
        'soda': 0,
        'gum': 0,
        'marmalade': 0,
        'marshmallow': 0,
      };
      cards.forEach(function (card) {
        if (card.kind === 'Мороженое') {
          foodType['icecream'] += 1;
        }
        if (card.kind === 'Газировка') {
          foodType['soda'] += 1;
        }
        if (card.kind === 'Жевательная резинка') {
          foodType['gum'] += 1;
        }
        if (card.kind === 'Мармелад') {
          foodType['marmalade'] += 1;
        }
        if (card.kind === 'Зефир') {
          foodType['marshmallow'] += 1;
        }
      });
      writeCounters(foodType);
    };

    var updatePropertyCounters = function (cards) {
      var foodProperty = {
        'sugar-free': 0,
        'vegetarian': 0,
        'gluten-free': 0
      };
      cards.forEach(function (card) {
        if (!card.nutritionFacts.sugar) {
          foodProperty['sugar-free'] += 1;
        }
        if (card.nutritionFacts.vegetarian) {
          foodProperty['vegetarian'] += 1;
        }
        if (!card.nutritionFacts.gluten) {
          foodProperty['gluten-free'] += 1;
        }
      });
      writeCounters(foodProperty);
    };

    updateMarkCounters(window.catalog.goods);
    updatePropertyCounters(window.catalog.goods);
    updateTypeCounters(window.catalog.goods);

    var defaultFilter = function (cards) {
      var result = filterByKind(cards, getCheckedValues(document.querySelectorAll('input[name="food-type"]')));
      return filterByNutritionFacts(result, getCheckedValues(document.querySelectorAll('input[name="food-property"]')));
    };

    var catalogSidebarElem = document.querySelector('.catalog__sidebar');
    catalogSidebarElem.addEventListener('change', function (evt) {
      var name = evt.target.name;
      var filteredCards = window.catalog.goods.slice();
      switch (name) {
        case 'sort':
          sortType = evt.target.value;
          filteredCards = defaultFilter(filteredCards);
          break;

        case 'mark':
          filteredCards = filterByMark(evt.target.value);
          break;

        case 'food-type':
          filteredCards = defaultFilter(filteredCards);
          updatePropertyCounters(filteredCards);
          break;

        case 'food-property':
          filteredCards = defaultFilter(filteredCards);
          break;
      }

      sortBy(filteredCards, sortType);
      window.catalog.addCardElems(filteredCards);
      window.catalog.displayEmptyFilterStub(filteredCards);

      window.filter.filteredCards = filteredCards;
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
    updateCatalog: updateCatalog,
    updateMarkCounters: updateMarkCounters
  };
})();
