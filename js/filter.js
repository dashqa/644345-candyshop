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

  // утсанавливает изначальные значения кол-ва товара у фильтров
  var setupInitialCounters = function (cards) {
    updateMarkCounters(cards);
    updatePropertyCounters(cards);
    updateTypeCounters(cards);
    updatePriceCounter(cards);
  };

  // записывает кол-во товара в элемент счетчика
  var writeCounters = function (inputs) {
    Object.keys(inputs).forEach(function (key) {
      document.querySelector('#' + key + '-count').textContent = '(' + inputs[key] + ')';
    });
  };

  // обновляет значения кол-ва товара у блока с фильтрами Избранное и В наличии
  var updateMarkCounters = function (cards) {
    var foodMark = {
      'favorite': 0,
      'availability': 0
    };
    cards.forEach(function (card) {
      if (card.favorite) {
        foodMark['favorite'] += 1;
      }
      if (card.amount > 0) {
        foodMark['availability'] += 1;
      }
    });
    writeCounters(foodMark);
  };

  // обновляет значения кол-ва товара у блока с фильтрами по категории
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

  // обновляет значения кол-ва товара у блока с фильтрами по составу
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

  // изменяет кол-во товаров, отфильтрованные по цене
  var updatePriceCounter = function (cards) {
    var priceCounter = document.querySelector('.range__count');
    priceCounter.textContent = '(' + cards.length + ')';
  };

  // обновляет каталог товаров в зависимости от выбранные фильтров
  var updateCatalog = function () {

    // вспомогательный глобальный массив в модуле, заполняется тогда, когда идет фильтрация
    var runtimeCards = window.catalog.goods.slice();
    var filteredCards = runtimeCards;

    // сброс чекнутых инпутов
    var setDefaultParams = function () {
      Array.from(document.querySelectorAll('input[name="food-type"], input[name="food-property"]')).forEach(function (elem) {
        elem.checked = false;
      });
    };

    // возвращает массив с объектами, которые имеют конкретную категорию
    var filterByKind = function (cards, kinds) {
      if (!kinds.length) {
        return cards;
      }
      return cards.filter(function (good) {
        return kinds.indexOf(GoodKind[good.kind]) !== -1;
      });
    };

    // возвращает массив с объектами, которые имеют конкретные характеристики товара (по составу)
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

    // возвращает массив с объектами, которые имеют конкретные характеристики товара (избранное и в наличии)
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

    // сотрировка по рейтингу
    var sortByRating = function (cards) {
      cards.sort(function (first, second) {
        if (second.rating.value !== first.rating.value) {
          return second.rating.value - first.rating.value;
        }
        return second.rating.number - first.rating.number;
      });
    };

    // сортировка товаров
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

    // возвращает массив объектов, отсортированные по цене
    var sortByPrice = function (cards, isByMin) {
      return cards.sort(function (first, second) {
        return isByMin ? first.price - second.price : second.price - first.price;
      });
    };

    // возвращает массив объектов, у которых выбран чекбокс
    var getCheckedValues = function (children) {
      return Array.from(children).reduce(function (accum, cur) {
        if (cur.checked) {
          accum.push(cur.value);
        }
        return accum;
      }, []);
    };

    // возвращает массив объектов, отсортированные по цене
    var filterByPrice = function (min, max) {
      return filteredCards.filter(function (card) {
        return card.price >= min && card.price <= max;
      });
    };

    // возвращает массив отсортированных карточек по категории и составу
    var defaultFilter = function (cards) {
      var result = filterByKind(cards, getCheckedValues(document.querySelectorAll('input[name="food-type"]')));
      return filterByNutritionFacts(result, getCheckedValues(document.querySelectorAll('input[name="food-property"]')));
    };

    // функция рендеринга отфильтрованных карточек
    var renderFilteredCards = function (min, max) {
      runtimeCards = filterByPrice(min, max);
      window.catalog.addCardElems(runtimeCards);
      window.catalog.displayEmptyFilterStub(runtimeCards);
      updatePriceCounter(runtimeCards);
    };

    // обработчик изменений инпутов внутри блока с фильтрами
    var catalogSidebarElem = document.querySelector('.catalog__sidebar');
    catalogSidebarElem.addEventListener('change', function (evt) {
      filteredCards = window.catalog.goods.slice();
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

      // передаем все отлифльтрованные карточки в вспомогательный массив
      runtimeCards = filteredCards;

      sortBy(runtimeCards, sortType);
      renderFilteredCards(window.slider.price.min, window.slider.price.max);
    });

    // обработчик "показать всё" в фильтрах
    var filterFormElem = document.querySelector('#filter-form');
    filterFormElem.addEventListener('submit', function (evt) {
      evt.preventDefault();
      filterFormElem.reset();
      filteredCards = window.catalog.goods;
      window.catalog.addCardElems(filteredCards);
    });

    window.filter.render = renderFilteredCards;
  };

  window.filter = {
    updateCatalog: updateCatalog,
    setupInitialCounters: setupInitialCounters,
    updateMarkCounters: updateMarkCounters
  };

})();
