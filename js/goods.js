'use strict';

var GOOD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var GOOD_PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];
var GOOD_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var GOODS_AMOUNT = 26;
// var GOODS_FOR_ORDER = 3;
var PICTURE_PATH = 'img/cards/';


var getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var getRandomInd = function (array) {
  return getRandomNum(0, array.length - 1);
};
var getRandomBool = function () {
  return Math.random() < 0.5;
};

var getRandomProp = function (property) {
  return property[getRandomInd(property)];
};

var getContent = function (contentArray) {
  var arrayCopy = contentArray.slice(); // делаем копию исходного массива
  var randomAmount = getRandomNum(1, arrayCopy.length); // количество свойств, которые будут объединены
  var contents = []; // новый массив
  for (var i = 0; i < randomAmount; i++) {
    var randomElemIndex = getRandomNum(0, arrayCopy.length - 1); // рандомный элемент массива, который будем вырезать
    var removedElem = arrayCopy.splice(randomElemIndex, 1); // вырезаем один рандомный элемент (массив с одним элементом)
    contents.push(removedElem); // пушим массив с одним элементом в массив contents
  }
  return contents.join(', '); // трансоформируем весь массив в строку с разделителем
};

var getGoodParam = function () {
  return {
    name: getRandomProp(GOOD_NAMES),
    picture: PICTURE_PATH + getRandomProp(GOOD_PICTURES),
    amount: getRandomNum(0, 20),
    price: getRandomNum(100, 1500),
    weight: getRandomNum(30, 300),
    rating: {
      value: getRandomNum(1, 5),
      number: getRandomNum(10, 900)
    },
    nutritionFacts: {
      sugar: getRandomBool(),
      energy: getRandomNum(70, 500),
      contents: getContent(GOOD_CONTENTS)
    }
  };
};

var createGoods = function (amount) {
  var goods = [];
  for (var i = 0; i < amount; i++) {
    goods.push(getGoodParam());
  }
  return goods;
};

var goods = createGoods(GOODS_AMOUNT); // массив с объектами товаров для карточек товаров
var basketGoods = []; // массив с объектами товаров, находящихся в корзине

// добавляет карточки с товарами на страницу
var addCardElems = function () {
  var cardElemTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var catalogCardsElem = document.querySelector('.catalog__cards');

  if (catalogCardsElem.classList.contains('catalog__cards--load')) {
    catalogCardsElem.classList.remove('catalog__cards--load');
    catalogCardsElem.children[0].classList.add('visually-hidden');
  }
  // рендеринг одной карточки товара
  var renderCard = function (good) {
    var cardElem = cardElemTemplate.cloneNode(true);
    cardElem.querySelector('.card__title').textContent = good.name;
    cardElem.querySelector('.star__count').textContent = good.rating.number;
    cardElem.querySelector('.card__composition-list').textContent = good.nutritionFacts.contents;
    cardElem.querySelector('.card__price').childNodes[0].textContent = good.price + ' ';
    cardElem.querySelector('.card__weight').textContent = '/ ' + good.weight + ' Г';
    cardElem.querySelector('.card__btn').addEventListener('click', function (evt) {
      evt.preventDefault();
      addGoodInBasket(good, renderBasket); // обработчик кнопки добавить в корзину, добавляет новый товар и перерендеривает страницу
    });

    // обработчик кнопки избранного
    cardElem.querySelector('.card__btn-favorite').addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.target.blur();
      evt.target.classList.toggle('card__btn-favorite--selected');
    });
    var cardImgElem = cardElem.querySelector('.card__img');
    cardImgElem.src = good.picture;
    cardImgElem.alt = good.name;


    if (good.amount <= 5) {
      cardElem.classList.remove('card--in-stock');
      cardElem.classList.add('card--' + (good.amount >= 1 ? 'little' : 'soon'));
    }

    var energyCalElem = good.nutritionFacts.energy + ' ккал';
    cardElem.querySelector('.card__characteristic').textContent = (!good.nutritionFacts.sugar ? 'Без сахара. ' : 'Содержит сахар. ') + energyCalElem;

    cardElem.querySelector('.stars__rating').classList.remove('stars__rating--five');
    var starsValue = [{
      class: 'one',
      end: 'а'
    }, {
      class: 'two',
      end: 'ы'
    }, {
      class: 'three',
      end: 'ы'
    }, {
      class: 'four',
      end: 'ы'
    }, {
      class: 'five',
      end: ''
    }];
    var starsElem = starsValue[good.rating.value - 1];
    var ratingElem = 'Рейтинг: ' + good.rating.value + ' звезд';
    cardElem.querySelector('.stars__rating').classList.add('stars__rating--' + starsElem.class);
    cardElem.querySelector('.stars__rating').textContent = ratingElem + starsElem.end;

    return cardElem;
  };

  var cardFragment = document.createDocumentFragment();
  for (var i = 0; i < goods.length; i++) {
    cardFragment.appendChild(renderCard(goods[i]));
  }

  return catalogCardsElem.appendChild(cardFragment);
};
addCardElems(); // временно запускаем вручную

// меняет кол-во одного уникального товара в корзине
var changeGoodOrderAmount = function (name, isIncrease) {
  var findByName = function (item) {
    return item.name === name;
  };
  var good = goods.find(findByName);
  var basketGood = basketGoods.find(findByName);

  if (isIncrease && good.amount >= 1) {
    good.amount -= 1;
    basketGood.orderedAmount += 1;
  } else if (!isIncrease && basketGood.orderedAmount > 0) {
    good.amount += 1;
    basketGood.orderedAmount -= 1;
  }

  window.currentGoodAmount = good.amount;
};

/* проверяет на уникальность товара с корзиной и добавляет если такого товара в корзине не существовало
аргументы - объект из массива товаров, коллбек (в данном случае функция перерендеринга корзины) */
var addGoodInBasket = function (good, callback) {
  if (good.amount > 0) {
    var isInBasket = basketGoods.some(function (item) {
      if (item.name === good.name) {
        item.orderedAmount += 1;
        return true;
      }
      return false;
    });
    if (!isInBasket) {
      var newGood = {
        name: good.name,
        price: good.price,
        picture: good.picture,
        orderedAmount: 1,
      };
      basketGoods.push(newGood);
    }
    good.amount -= 1;
    callback();
  }
};

/* удаляет объект товара из массива корзины
аргумент - значение ключа "название товара" */
var removeFromBasketArray = function (name) {
  var findByName = function (item) {
    return item.name === name;
  };
  var basketGood = basketGoods.find(findByName);
  basketGoods.splice((basketGoods.indexOf(basketGood)), 1);
};

// отрисовывает корзину
var renderBasket = function () {
  var cardOrderElemTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var emptyCardOrderElemTemplate = document.querySelector('#cards-empty').content.querySelector('.goods__card-empty');
  var goodsWrapperElem = document.querySelector('.goods__cards');
  var goodsTotalElem = document.querySelector('.goods__total');

  if (goodsWrapperElem.classList.contains('goods__cards--empty')) {
    goodsWrapperElem.classList.remove('goods__cards--empty');
    goodsTotalElem.classList.remove('visually-hidden');
  }

  // рендеринг одной карточки в корзине
  var renderCardOrder = function (good) {
    var orderElem = cardOrderElemTemplate.cloneNode(true);
    orderElem.querySelector('.card-order__title').textContent = good.name;
    orderElem.querySelector('.card-order__price').textContent = good.price + ' ₽';
    orderElem.querySelector('.card-order__count').setAttribute('value', good.orderedAmount);
    var cardOrderImgElem = orderElem.querySelector('.card-order__img');
    cardOrderImgElem.src = good.picture;
    cardOrderImgElem.alt = good.name;

    var cardOrderAmountElem = orderElem.querySelector('.card-order__amount');
    // обработчик кнопки добавления/удаления кол-ва товара в корзине
    cardOrderAmountElem.addEventListener('click', function (evt) {

      // отображение загрушки, если в наличии не осталось товара
      var displayOutOfStockElem = function (currentAmout) {
        var outOfStockElem = evt.currentTarget.querySelector('.card-order__outofstock');
        if (currentAmout === 0) {
          outOfStockElem.classList.add('card-order__outofstock--active');
        } else {
          outOfStockElem.classList.remove('card-order__outofstock--active');
        }
      };

      // если увеличиваем кол-во
      if (evt.target.classList.contains('card-order__btn--increase')) {
        changeGoodOrderAmount(good.name, true);
        orderElem.querySelector('.card-order__count').setAttribute('value', good.orderedAmount);
        displayOutOfStockElem(window.currentGoodAmount);
        renderTotalOrderElem();

        // если уменьшаем кол-во
      } else if (evt.target.classList.contains('card-order__btn--decrease')) {
        changeGoodOrderAmount(good.name, false);
        orderElem.querySelector('.card-order__count').setAttribute('value', good.orderedAmount);
        displayEmptyOrderStub();
        displayOutOfStockElem(window.currentGoodAmount);
        renderTotalOrderElem();
      }
    });


    // отображение заглушки, если в корзине нет товаров
    var displayEmptyOrderStub = function () {
      if (good.orderedAmount < 1) {
        removeFromBasketArray(good.name);
        orderElem.remove();
        if (basketGoods.length === 0) {
          goodsWrapperElem.classList.add('goods__cards--empty');
          goodsTotalElem.classList.add('visually-hidden');
          var emptyOrderStub = emptyCardOrderElemTemplate.cloneNode(true);
          goodsWrapperElem.appendChild(emptyOrderStub);
        }
      }
    };

    // обработчик клика на кнопку удаления карточки товара из корзины
    orderElem.addEventListener('click', function (evt) {
      if (evt.target.classList.contains('card-order__close')) {
        evt.preventDefault();
        good.orderedAmount = 0;
        renderTotalOrderElem();
        displayEmptyOrderStub();
      }
    });

    return orderElem;
  };

  // отображение итога кол-ва товаров и цены
  var renderTotalOrderElem = function () {
    var totalOrderAmount = basketGoods.length;
    var basketElemInHeader = document.querySelector('.main-header__basket');

    var calcTotal = function () {
      var totalPrice = 0;
      var totalAmount = 0;
      for (var i = 0; i <= totalOrderAmount - 1; i++) {
        totalPrice += basketGoods[i].price * basketGoods[i].orderedAmount;
        totalAmount += basketGoods[i].orderedAmount;
      }
      return {
        totalPrice: totalPrice,
        totalAmount: totalAmount
      };
    };

    // склоняет окончание слова в зависимости от числа
    function declOfNum(number, titles) {
      var cases = [2, 0, 1, 1, 1, 2];
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    var totalWithDecline = calcTotal().totalAmount + ' ' + declOfNum(calcTotal().totalAmount, ['товар', 'товара', 'товаров']);
    goodsTotalElem.querySelector('.goods__total-count').textContent = 'Итого за ' + totalWithDecline + ': ' + calcTotal().totalPrice + ' ₽';
    basketElemInHeader.textContent = 'В корзине ' + totalWithDecline;
  };

  renderTotalOrderElem();

  var cardOrderFragment = document.createDocumentFragment();
  for (var j = 0; j < basketGoods.length; j++) {
    cardOrderFragment.appendChild(renderCardOrder(basketGoods[j]));
  }

  goodsWrapperElem.innerHTML = '';
  return goodsWrapperElem.appendChild(cardOrderFragment);
};

var changeDeliveryMethod = function () {
  var toggleBtnElem = document.querySelector('.deliver__toggle');

  toggleBtnElem.addEventListener('click', function (evt) {
    var deliveryStoreWrap = document.querySelector('.deliver__store');
    var deliveryCourierWrap = document.querySelector('.deliver__courier');

    if (evt.target.id === 'deliver__store') {
      onButtonClick(deliveryStoreWrap, deliveryCourierWrap);

    } else if (evt.target.id === 'deliver__courier') {
      onButtonClick(deliveryCourierWrap, deliveryStoreWrap);
    }
  });

  var onButtonClick = function (thisWrap, anotherWrap) {
    if (thisWrap.classList.contains('visually-hidden')) {
      thisWrap.classList.remove('visually-hidden');
      anotherWrap.classList.add('visually-hidden');
    }
  };

};

changeDeliveryMethod();

// var rangeSliderHandler.addEventListener('mousedown', function (evt) {
//   evt.preventDefault();

//   var dragged = false;
//   var startXCoords = evt.clientX;

//   var onMouseMove = function (moveEvt) {
//     moveEvt.preventDefault();
//     dragged = true;
//     var shift = startXCoords - moveEvt.clientX;

//     startCoord = moveEvt.clientX;
//     setupDialogElement.style.top = (setupDialogElement.offsetTop - shift.y) + 'px';
//     setupDialogElement.style.left = (setupDialogElement.offsetLeft - shift.x) + 'px';

//   };

//   var onMouseUp = function (upEvt) {
//     upEvt.preventDefault();

//     document.removeEventListener('mousemove', onMouseMove);
//     document.removeEventListener('mouseup', onMouseUp);

//     if (dragged) {
//       var onClickPreventDefault = function (evt) {
//         evt.preventDefault();
//         dialogHandler.removeEventListener('click', onClickPreventDefault)
//       };
//       dialogHandler.addEventListener('click', onClickPreventDefault);
//     }

//   };

//   document.addEventListener('mousemove', onMouseMove);
//   document.addEventListener('mouseup', onMouseUp);
// });
