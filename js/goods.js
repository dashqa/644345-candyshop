'use strict';

var GOOD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var GOOD_PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];
var GOOD_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var GOODS_AMOUNT = 26;
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

// склоняет окончание слова в зависимости от числа
function declOfNum(number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

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
    var starsValue = ['one', 'two', 'three', 'four', 'five'];
    var starsElem = starsValue[good.rating.value - 1];
    var ratingElem = 'Рейтинг: ' + good.rating.value + ' ' + declOfNum(good.rating.value, ['звезда', 'звезды', 'звезд']);
    cardElem.querySelector('.stars__rating').classList.add('stars__rating--' + starsElem);
    cardElem.querySelector('.stars__rating').textContent = ratingElem;

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
    orderElem.querySelector('.card-order__count').value = good.orderedAmount;
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

      // событие при нажатии на увеличение/уменьшение кол-ва товара
      var onChangeAmountButtonClick = function () {
        orderElem.querySelector('.card-order__count').value = good.orderedAmount;
        displayOutOfStockElem(window.currentGoodAmount);
        renderTotalOrderElem();
      };

      // если увеличиваем кол-во
      if (evt.target.classList.contains('card-order__btn--increase')) {
        changeGoodOrderAmount(good.name, true);
        onChangeAmountButtonClick();

        // если уменьшаем кол-во
      } else if (evt.target.classList.contains('card-order__btn--decrease')) {
        changeGoodOrderAmount(good.name, false);
        displayEmptyOrderStub();
        onChangeAmountButtonClick();
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


// отключает/включает fieldset внутри конкретного враппера
var disableFieldset = function (wrapper) {
  var fieldset = wrapper.querySelector('fieldset');
  if (fieldset) {
    fieldset.disabled = !fieldset.disabled;
  }
};

// функция для обработчика change
var onToggleBtnElemChange = function (target, method1, method2, methodsObj) {
  if (target.id === method1 ||
    target.id === method2) {
    methodsObj[method1].classList.toggle('visually-hidden');
    methodsObj[method2].classList.toggle('visually-hidden');
    disableFieldset(methodsObj[method1]);
    disableFieldset(methodsObj[method2]);
  }
};

// смена способа доставки
var changeDeliveryMethod = function () {
  var toggleBtnElem = document.querySelector('.deliver__toggle');

  var STORE = 'deliver__store';
  var COURIER = 'deliver__courier';

  var Delivery = {};
  Delivery[STORE] = document.querySelector('.' + STORE);
  Delivery[COURIER] = document.querySelector('.' + COURIER);

  toggleBtnElem.addEventListener('change', function (evt) {
    onToggleBtnElemChange(evt.target, STORE, COURIER, Delivery);
  });
};

changeDeliveryMethod();

// смена способа оплаты
var changePaymentMethod = function () {
  var toggleBtnElem = document.querySelector('.payment__method');

  var CARD = 'payment__card';
  var CASH = 'payment__cash';

  var Payment = {};
  Payment[CARD] = document.querySelector('.' + CARD + '-wrap');
  Payment[CASH] = document.querySelector('.' + CASH + '-wrap');

  toggleBtnElem.addEventListener('change', function (evt) {
    onToggleBtnElemChange(evt.target, CARD, CASH, Payment);
  });
};

changePaymentMethod();

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
      case Toggler[LEFT]:return moveToggler(LEFT, slider.startPos, Toggler[RIGHT].offsetLeft, shift);
      case Toggler[RIGHT]:return moveToggler(RIGHT, Toggler[LEFT].offsetLeft, slider.endPos, shift);
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

// валидация полей ввода
var cardNumberElem = document.querySelector('#payment__card-number');
var cardExpiresElem = document.querySelector('#payment__card-date');
var cardCvcElem = document.querySelector('#payment__card-cvc');
var holderName = document.querySelector('#payment__cardholder');

var onInputFocus = function (input, text) {
  input.addEventListener('input', function () {
    validateOnInput(input, text);
    changeCardStatus();
  });
};

var validateOnInput = function (input, text) {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(text);
    input.classList.remove('text-input--correct');
    input.classList.add('text-input--error');
  } else {
    input.setCustomValidity('');
    input.classList.remove('text-input--error');
    input.classList.add('text-input--correct');
  }
};

cardNumberElem.addEventListener('focus', onInputFocus(cardNumberElem, 'Введите 16 цифр карты без пробелов'));
cardExpiresElem.addEventListener('focus', onInputFocus(cardExpiresElem, 'Введите дату в формате "мм/гг"'));
cardCvcElem.addEventListener('focus', onInputFocus(cardCvcElem, 'Три цифры с задней стороны вашей карты'));
holderName.addEventListener('focus', onInputFocus(holderName, 'Вводите только латинские буквы'));

var luhnAlgorithm = function () {
  var array = cardNumberElem.value.split('');
  var sum = 0;
  array.toString();
  for (var i = 0; i < array.length; i++) {
    var parsedNum = parseInt(array[i], 10);
    if (i % 2 === 0) {
      var increased = parsedNum *= 2;
      parsedNum = (increased > 9) ? increased -= 9 : increased;
    }
    sum += parsedNum;
  }
  return (sum % 10) === 0;
};

var cardStatus = document.querySelector('.payment__card-status');

var changeCardStatus = function () {
  if (luhnAlgorithm() === true && cardNumberElem.validity.valid && cardExpiresElem.validity.valid && cardCvcElem.validity.valid && holderName.validity.valid) {
    cardStatus.textContent = 'Одобрен';
    return true;
  } else {
    cardStatus.textContent = 'Не определен';
    return false;
  }
};
