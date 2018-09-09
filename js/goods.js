'use strict';

var GOOD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var GOOD_PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];
var GOOD_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var CONTENTS_AMOUNT = 5;
var GOODS_AMOUNT = 26;
var GOODS_FOR_ORDER = 3;
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


var getRandomName = function (names) {
  return names[getRandomInd(names)];
};

var getRandomPicture = function (folderPath) {
  return folderPath + GOOD_PICTURES[getRandomInd(GOOD_PICTURES)];
};

var getContent = function (contentArray, amount) {
  var contents = contentArray[getRandomInd(contentArray)];
  for (var i = 1; i < amount; i++) {
    // TODO: обсудить возможность исключения повторов
    // if (contents.includes(contentArray[getRandomInd(contentArray)])) {
    //   continue;
    // }
    contents += ', ' + contentArray[getRandomInd(contentArray)];
  }
  return contents;
};

var getGoodParam = function () {
  return {
    name: getRandomName(GOOD_NAMES),
    picture: getRandomPicture(PICTURE_PATH),
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
      contents: getContent(GOOD_CONTENTS, CONTENTS_AMOUNT)
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

var addCardElems = function () {
  var cardElemTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var catalogCardsElem = document.querySelector('.catalog__cards');

  if (catalogCardsElem.classList.contains('catalog__cards--load')) {
    catalogCardsElem.classList.remove('catalog__cards--load');
    catalogCardsElem.children[0].classList.add('visually-hidden');
  }

  var renderCard = function (good) {
    var cardElem = cardElemTemplate.cloneNode(true);
    cardElem.querySelector('.card__title').textContent = good.name;
    cardElem.querySelector('.star__count').textContent = good.rating.number;
    cardElem.querySelector('.card__composition-list').textContent = good.nutritionFacts.contents;
    // cardElem.querySelector('.card__price').innerHTML = good.price + ' <span class="card__currency">₽</span><span class="card__weight">/ ' + good.weight + ' Г</span>';
    cardElem.querySelector('.card__price').childNodes[0].textContent = good.price + ' ';
    cardElem.querySelector('.card__weight').textContent = '/ ' + good.weight + ' Г';

    var cardImgElem = cardElem.querySelector('.card__img');
    cardImgElem.src = good.picture;
    cardImgElem.alt = good.name;

    if (good.amount <= 5) {
      cardElem.classList.remove('card--in-stock');
      if (good.amount > 1) {
        cardElem.classList.add('card--little');
      } else if (good.amount < 1) {
        cardElem.classList.add('card--soon');
      }
    } else {
      cardElem.classList.add('card--in-stock');
    }

    var energyCalElem = good.nutritionFacts.energy + ' ккал';
    cardElem.querySelector('.card__characteristic').textContent = !good.nutritionFacts.sugar ? 'Без сахара. ' + energyCalElem : 'Содержит сахар. ' + energyCalElem;

    cardElem.querySelector('.stars__rating').classList.remove('stars__rating--five');
    var ratingElem = 'Рейтинг: ' + good.rating.value + ' звезд';
    switch (good.rating.value) {
      case 1:
        cardElem.querySelector('.stars__rating').classList.add('stars__rating--one');
        cardElem.querySelector('.stars__rating').textContent = ratingElem + 'а';
        break;
      case 2:
        cardElem.querySelector('.stars__rating').classList.add('stars__rating--two');
        cardElem.querySelector('.stars__rating').textContent = ratingElem + 'ы';
        break;
      case 3:
        cardElem.querySelector('.stars__rating').classList.add('stars__rating--three');
        cardElem.querySelector('.stars__rating').textContent = ratingElem + 'ы';
        break;
      case 4:
        cardElem.querySelector('.stars__rating').classList.add('stars__rating--four');
        cardElem.querySelector('.stars__rating').textContent = ratingElem + 'ы';
        break;

      default:
        cardElem.querySelector('.stars__rating').classList.add('stars__rating--five');
        cardElem.querySelector('.stars__rating').textContent = ratingElem;
    }

    return cardElem;
  };

  var cardFragment = document.createDocumentFragment();
  var cards = createGoods(GOODS_AMOUNT);
  for (var i = 0; i < cards.length; i++) {
    cardFragment.appendChild(renderCard(cards[i]));
  }

  return catalogCardsElem.appendChild(cardFragment);
};


var addForOrder = function () {
  var cardOrderElemTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var cardOrderElem = document.querySelector('.goods__cards');

  if (cardOrderElem.classList.contains('goods__cards--empty')) {
    cardOrderElem.classList.remove('goods__cards--empty');
    cardOrderElem.children[0].classList.add('visually-hidden');
  }

  var renderCardOrder = function (good) {
    var orderElem = cardOrderElemTemplate.cloneNode(true);
    orderElem.querySelector('.card-order__title').textContent = good.name;
    orderElem.querySelector('.card-order__price').textContent = good.price + ' ₽';

    var cardOrderImgElem = orderElem.querySelector('.card-order__img');
    cardOrderImgElem.src = good.picture;
    cardOrderImgElem.alt = good.name;

    return orderElem;
  };

  var cardOrderFragment = document.createDocumentFragment();
  var cardsForOrder = createGoods(GOODS_FOR_ORDER);
  for (var j = 0; j < cardsForOrder.length; j++) {
    cardOrderFragment.appendChild(renderCardOrder(cardsForOrder[j]));
  }

  return cardOrderElem.appendChild(cardOrderFragment);
};

addCardElems(); // временно вызываем функцию вручную
addForOrder(); // временно вызываем функцию вручную
