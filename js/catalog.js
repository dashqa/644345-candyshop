'use strict';

(function () {
  window.catalog = {

    // добавляет карточки с товарами на страницу
    addCardElems: function () {
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
          window.basket.addGoodInBasket(good, window.basket.renderBasket); // обработчик кнопки добавить в корзину, добавляет новый товар и перерендеривает страницу
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
        var ratingElem = 'Рейтинг: ' + good.rating.value + ' ' + window.utils.declOfNum(good.rating.value, ['звезда', 'звезды', 'звезд']);
        cardElem.querySelector('.stars__rating').classList.add('stars__rating--' + starsElem);
        cardElem.querySelector('.stars__rating').textContent = ratingElem;

        return cardElem;
      };


      var cardFragment = document.createDocumentFragment();
      for (var i = 0; i < window.data.goods.length; i++) {
        cardFragment.appendChild(renderCard(window.data.goods[i]));
      }

      return catalogCardsElem.appendChild(cardFragment);
    }
  };

  window.catalog.addCardElems();
})();
