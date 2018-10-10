'use strict';

(function () {
  var basketGoods = []; // массив с объектами товаров, находящихся в корзине
  var cardOrderElemTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var emptyCardOrderElemTemplate = document.querySelector('#cards-empty').content.querySelector('.goods__card-empty');
  var goodsWrapperElem = document.querySelector('.goods__cards');
  var goodsTotalElem = document.querySelector('.goods__total');

  /* проверяет на уникальность товара из каталога с корзиной и добавляет, если такого товара в корзине не существовало
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

  // меняет кол-во одного уникального товара в корзине
  var changeGoodOrderAmount = function (name, isIncrease) {
    var findByName = function (item) {
      return item.name === name;
    };
    var good = window.catalog.goods.find(findByName);
    var basketGood = basketGoods.find(findByName);

    if (isIncrease && good.amount >= 1) {
      good.amount -= 1;
      basketGood.orderedAmount += 1;
    } else if (!isIncrease && basketGood.orderedAmount > 0) {
      good.amount += 1;
      basketGood.orderedAmount -= 1;
    }

    window.basket.currentGoodAmount = good.amount;
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

  // рендеринг одной карточки в корзине
  var renderCardOrder = function (good) {
    var orderElem = cardOrderElemTemplate.cloneNode(true);
    var cardOrderImgElem = orderElem.querySelector('.card-order__img');
    var cardOrderCountElem = orderElem.querySelector('.card-order__count');
    var cardOrderAmountElem = orderElem.querySelector('.card-order__amount');

    orderElem.querySelector('.card-order__title').textContent = good.name;
    orderElem.querySelector('.card-order__price').textContent = good.price + ' ₽';
    cardOrderImgElem.src = window.utils.PICTURE_PATH + good.picture;
    cardOrderImgElem.alt = good.name;
    cardOrderCountElem.value = good.orderedAmount;
    cardOrderCountElem.name = good.name;

    // обработчик кнопки добавления/удаления кол-ва товара в корзине
    cardOrderAmountElem.addEventListener('click', function (evt) {

      // отображение заглушки, если в наличии не осталось товара
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
        displayOutOfStockElem(window.basket.currentGoodAmount);
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
    var displayEmptyStub = function () {
      goodsWrapperElem.classList.add('goods__cards--empty');
      goodsTotalElem.classList.add('visually-hidden');
      var emptyOrderStub = emptyCardOrderElemTemplate.cloneNode(true);
      goodsWrapperElem.appendChild(emptyOrderStub);
    };

    // условия отображения заглушки
    var displayEmptyOrderStub = function () {
      if (good.orderedAmount < 1) {
        removeFromBasketArray(good.name);
        orderElem.remove();
        if (basketGoods.length === 0) {
          displayEmptyStub();
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

    window.basket.displayEmptyStub = displayEmptyStub;

    return orderElem;
  };

  // отрисовывает корзину
  var renderBasket = function () {
    if (goodsWrapperElem.classList.contains('goods__cards--empty')) {
      goodsWrapperElem.classList.remove('goods__cards--empty');
      goodsTotalElem.classList.remove('visually-hidden');
    }

    renderTotalOrderElem();
    goodsWrapperElem.innerHTML = '';
    window.order.setupSubmition();

    var cardOrderFragment = document.createDocumentFragment();

    basketGoods.forEach(function (good) {
      cardOrderFragment.appendChild(renderCardOrder(good));
    });
    return goodsWrapperElem.appendChild(cardOrderFragment);
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

    var totalWithDecline = calcTotal().totalAmount + ' ' + window.utils.declOfNum(calcTotal().totalAmount, ['товар', 'товара', 'товаров']);
    goodsTotalElem.querySelector('.goods__total-count').childNodes[0].textContent = 'Итого за ' + totalWithDecline + ': ';
    goodsTotalElem.querySelector('.goods__price').textContent = calcTotal().totalPrice + ' ₽';
    basketElemInHeader.textContent = 'В корзине ' + totalWithDecline;
  };

  window.basket = {
    goodsWrapperElem: goodsWrapperElem,
    goods: basketGoods,
    addGoodInBasket: addGoodInBasket,
    render: renderBasket,
    renderTotalOrderElem: renderTotalOrderElem,
    changeGoodOrderAmount: changeGoodOrderAmount
  };
})();
