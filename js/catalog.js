'use strict';

(function () {
  var cardElemTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var catalogCardsElem = document.querySelector('.catalog__cards');
  var catalogLoadStubElem = catalogCardsElem.querySelector('.catalog__load');

  var emptyFilterStubElemTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
  var emptyFilterStubElem = emptyFilterStubElemTemplate.cloneNode(true);
  catalogCardsElem.appendChild(emptyFilterStubElem);

  var goodsArray = []; // массив всех товаров

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
      window.basket.addGoodInBasket(good, window.basket.renderBasket); // обработчик кнопки добавить в корзину, добавляет новый товар и перерендеривает страницу
    });
    if (good.favorite) {
      cardElem.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
    }

    // обработчик кнопки избранного
    cardElem.querySelector('.card__btn-favorite').addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.target.blur();
      evt.target.classList.toggle('card__btn-favorite--selected');
      good.favorite = (evt.target.classList.contains('card__btn-favorite--selected'));
      window.filter.updateMarkCounters(window.catalog.goods);
    });

    // обработчик кнопки 'состав'
    cardElem.querySelector('.card__main').addEventListener('click', function (evt) {
      if (evt.target.classList.contains('card__btn-composition')) {
        var cardComposElem = evt.currentTarget.querySelector('.card__composition');
        cardComposElem.classList.toggle('card__composition--hidden');
      }
    });

    var cardImgElem = cardElem.querySelector('.card__img');
    cardImgElem.src = window.utils.PICTURE_PATH + good.picture;
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
    var ratingElem = 'Рейтинг: ' + good.rating.value + ' ' + window.utils.declOfNum(good.rating.value, ['звезда', 'звезды', 'звезд']);
    cardElem.querySelector('.stars__rating').classList.add('stars__rating--' + starsElem);
    cardElem.querySelector('.stars__rating').textContent = ratingElem;

    return cardElem;
  };

  // отображение заглушки в случае слишком строгой фильтрации
  var displayEmptyFilterStub = function (cards) {
    if (cards.length === 0) {
      emptyFilterStubElem.classList.remove('visually-hidden');
    } else {
      emptyFilterStubElem.classList.add('visually-hidden');
    }
  };

  // очистка карточек
  var cleanCards = function (wrapper) {
    var oldCards = wrapper.querySelectorAll('article');
    oldCards.forEach(function (card) {
      card.remove();
    });
  };

  // рендеринг всех карточек
  var addCardElems = function (goods) {
    if (catalogCardsElem.classList.contains('catalog__cards--load')) {
      catalogCardsElem.classList.remove('catalog__cards--load');
      catalogLoadStubElem.classList.add('visually-hidden');
    }
    cleanCards(catalogCardsElem);

    var cardFragment = document.createDocumentFragment();

    goods.forEach(function (good) {
      cardFragment.appendChild(renderCard(good));
    });
    return catalogCardsElem.appendChild(cardFragment);
  };

  // в случае удачной загрузки данных с сервера
  var onSuccessLoad = function (data) {
    goodsArray = data;
    addCardElems(goodsArray);
    window.filter.setupInitialCounters(goodsArray);

    window.catalog.goods = goodsArray;
    window.filter.updateCatalog();
  };

  window.backend.load(onSuccessLoad, window.error.onErrorUpload);

  window.catalog = {
    addCardElems: addCardElems,
    displayEmptyFilterStub: displayEmptyFilterStub,
    cleanCards: cleanCards
  };

})();
