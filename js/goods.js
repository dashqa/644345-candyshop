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
    cardElem.querySelector('.card__price').childNodes[0].textContent = good.price + ' ';
    cardElem.querySelector('.card__weight').textContent = '/ ' + good.weight + ' Г';

    var cardImgElem = cardElem.querySelector('.card__img');
    cardImgElem.src = good.picture;
    cardImgElem.alt = good.name;

    if (good.amount <= 5) {
      cardElem.classList.remove('card--in-stock');
      cardElem.classList.add('card--' + (good.amount > 1 ? 'little' : 'soon'));
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
  for (var i = 0; i < cards.length; i++) {
    cardFragment.appendChild(renderCard(cards[i]));
  }

  return catalogCardsElem.appendChild(cardFragment);
};
addCardElems();

var cards = createGoods(GOODS_AMOUNT); // массив всех карточек

// находим элемент карточки, на которой кликнули добавить в корзину
var cardElem = document.querySelectorAll('.card');
for (var i = 0; i < cardElem.length; i++) {
  cardElem[i].addEventListener('click', function (evt) {
    if (evt.target.className === 'card__btn') {
      return evt.currentTarget;
    }
    return evt.stopPropagation;
  });
}

// var addForOrder = function () {
//   var cardOrderElemTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
//   var cardOrderElem = document.querySelector('.goods__cards');

//   if (cardOrderElem.classList.contains('goods__cards--empty')) {
//     cardOrderElem.classList.remove('goods__cards--empty');
//     cardOrderElem.children[0].classList.add('visually-hidden');
//   }

//   var renderCardOrder = function (good) {
//     var orderElem = cardOrderElemTemplate.cloneNode(true);
//     orderElem.querySelector('.card-order__title').textContent = good.name;
//     orderElem.querySelector('.card-order__price').textContent = good.price + ' ₽';

//     var cardOrderImgElem = orderElem.querySelector('.card-order__img');
//     cardOrderImgElem.src = good.picture;
//     cardOrderImgElem.alt = good.name;

//     return orderElem;
//   };

//   var cardOrderFragment = document.createDocumentFragment();
//   for (var j = 0; j < cardForOrder.length; j++) {
//     cardOrderFragment.appendChild(renderCardOrder(cardForOrder[j]));
//   }

//   return cardOrderElem.appendChild(cardOrderFragment);
// };

// addForOrder(); // временно вызываем функцию вручную


var favoriteButtonElem = document.querySelector('.card__btn-favorite'); // кнопка избранного
favoriteButtonElem.addEventListener('click', function () {
  favoriteButtonElem.classList.toggle('card__btn-favorite--selected');
});
