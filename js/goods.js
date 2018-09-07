'use strict';

var GOOD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var GOOD_PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];
var GOOD_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var CONTENTS_AMOUNT = 5;
var GOODS_AMOUNT = 26;
var PICTURE_PATH = 'img/cards/';


var getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
var getRandomInd = function (array) {
  return Math.floor(Math.random() * array.length);
};
var getRandomBool = function () {
  return Math.random() < 0.5;
};


var getRandomName = function (names) {
  return names[getRandomInd(names)];
};

var getRandomPicture = function (folderPath) {
  var picture = folderPath + GOOD_PICTURES[getRandomInd(GOOD_PICTURES)];
  return picture;
};

var getContent = function (contentArray, amount) {
  var contents = contentArray[getRandomInd(contentArray)];
  for (var i = 1; i < amount; i++) {
    // if (contents.includes(contentArray[getRandomInd(contentArray)])) {   надо обсудить это
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

var catalogCardsElem = document.querySelector('.catalog__cards');

if (catalogCardsElem.classList.contains('catalog__cards--load')) {
  catalogCardsElem.classList.remove('catalog__cards--load');
  catalogCardsElem.children[0].classList.add('visually-hidden');
}

var cardElemTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
var cardElemWrapper = document.querySelector('.catalog__cards-wrap');

var renderCard = function (good) {
  var cardElem = cardElemTemplate.cloneNode(true);
  cardElem.querySelector('card__title').textContent = good.name;
  cardElem.querySelector('star__count').textContent = good.rating.number;
  cardElem.querySelector('card__composition-list').textContent = good.nutritionFacts.contents;
  cardElem.querySelector('card__price').insertAdjacentText('afterBegin', good.price);
  cardElem.querySelector('card__weight').textContent = good.weight + ' Г';


  if (good.amount > 5) {
    cardElem.classList.add('card--in-stock');
  } else if (good.amount > 1 && good.amount <= 5) {
    cardElem.classList.add('card--little');
  } else if (good.amount < 1) {
    cardElem.classList.add('card--soon');
  }

  var energyCal = good.nutritionFacts.energy + ' ккал';
  if (good.nutritionFacts.sugar) {
    cardElem.querySelector('card__characteristic').textContent = 'Содержит сахар. ' + energyCal;
  } else {
    cardElem.querySelector('card__characteristic').textContent = 'Без сахара. ' + energyCal;
  }


  if (good.rating.value === 1) {
    cardElem.querySelector('stars__rating').classList.add('stars__rating--one');
  } else if (good.rating.value === 2) {
    cardElem.querySelector('stars__rating').classList.add('stars__rating--two');
  } else if (good.rating.value === 3) {
    cardElem.querySelector('stars__rating').classList.add('stars__rating--three');
  } else if (good.rating.value === 4) {
    cardElem.querySelector('stars__rating').classList.add('stars__rating--four');
  } else if (good.rating.value === 5) {
    cardElem.querySelector('stars__rating').classList.add('stars__rating--five');
  }

  return cardElem;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < createGoods(GOODS_AMOUNT).length; i++) {
  fragment.appendChild(renderCard(createGoods(GOODS_AMOUNT)[i]));
}
cardElemWrapper.appendChild(fragment);
