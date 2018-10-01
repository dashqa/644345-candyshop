'use strict';

(function () {
  var GOOD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
  var GOOD_PICTURES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];
  var GOOD_CONTENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
  var GOODS_AMOUNT = 26;
  var PICTURE_PATH = 'img/cards/';

  var getRandomProp = function (property) {
    return property[window.utils.getRandomInd(property)];
  };

  var getContent = function (contentArray) {
    var arrayCopy = contentArray.slice(); // делаем копию исходного массива
    var randomAmount = window.utils.getRandomNum(1, arrayCopy.length); // количество свойств, которые будут объединены
    var contents = []; // новый массив
    for (var i = 0; i < randomAmount; i++) {
      var randomElemIndex = window.utils.getRandomNum(0, arrayCopy.length - 1); // рандомный элемент массива, который будем вырезать
      var removedElem = arrayCopy.splice(randomElemIndex, 1); // вырезаем один рандомный элемент (массив с одним элементом)
      contents.push(removedElem); // пушим массив с одним элементом в массив contents
    }
    return contents.join(', '); // трансоформируем весь массив в строку с разделителем
  };

  var getGoodParam = function () {
    return {
      name: getRandomProp(GOOD_NAMES),
      picture: PICTURE_PATH + getRandomProp(GOOD_PICTURES),
      amount: window.utils.getRandomNum(0, 20),
      price: window.utils.getRandomNum(100, 1500),
      weight: window.utils.getRandomNum(30, 300),
      rating: {
        value: window.utils.getRandomNum(1, 5),
        number: window.utils.getRandomNum(10, 900)
      },
      nutritionFacts: {
        sugar: window.utils.getRandomBool(),
        energy: window.utils.getRandomNum(70, 500),
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


  window.data = {
    goods: goods
  };
})();
