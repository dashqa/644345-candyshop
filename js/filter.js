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

  var setupInitialCounters = function (cards) {
    updateMarkCounters(cards);
    updatePropertyCounters(cards);
    updateTypeCounters(cards);
  };

  // записывает кол-во товара в элемент счетчика
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

  var updateCatalog = function () {
    // сброс чекнутых инпутов
    var setDefaultParams = function () {
      Array.from(document.querySelectorAll('input[name="food-type"], input[name="food-property"]')).forEach(function (elem) {
        elem.checked = false;
      });
    };

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

    var defaultFilter = function (cards) {
      var result = filterByKind(cards, getCheckedValues(document.querySelectorAll('input[name="food-type"]')));
      return filterByNutritionFacts(result, getCheckedValues(document.querySelectorAll('input[name="food-property"]')));
    };

    var catalogSidebarElem = document.querySelector('.catalog__sidebar');
    catalogSidebarElem.addEventListener('change', function (evt) {
      var filteredCards = window.catalog.goods.slice();
      var name = evt.target.name;
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

    // обработчик "показать всё" в фильтрах
    var filterForm = document.querySelector('#filter-form');
    filterForm.addEventListener('submit', function (evt) {
      evt.preventDefault();
      filterForm.reset();
      window.filter.filteredCards = window.catalog.goods;
      window.catalog.addCardElems(window.filter.filteredCards);
    });

  };

  window.filter = {
    updateCatalog: updateCatalog,
    setupInitialCounters: setupInitialCounters,
    updateMarkCounters: updateMarkCounters
  };

})();
