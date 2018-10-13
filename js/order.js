'use strict';

(function () {
  var STORE = 'deliver__store';
  var COURIER = 'deliver__courier';
  var CARD = 'payment__card';
  var CASH = 'payment__cash';

  var formElem = document.querySelector('#order-form');

  var MapImage = {
    PATH: 'img/map/',
    EXTENSION: '.jpg'
  };

  var storeNameToAdress = {
    academicheskaya: 'проспект Науки, д. 19, корп. 3, литер А, ТК «Платформа», 3-й этаж, секция 310',
    vasileostrovskaya: 'м. Василеостровская',
    rechka: 'м.Черная речка',
    petrogradskaya: 'м.Петроградская',
    proletarskaya: 'м.Пролетарская',
    vostaniya: 'м.Площадь Восстания',
    prosvesheniya: 'м.Проспект Просвещения',
    frunzenskaya: 'м.Фрунзенская',
    chernishevskaya: 'м.Чернышевская',
    tehinstitute: 'м.Технологический институт'
  };

  var setupSubmition = function () {
    var submitBtnElem = formElem.querySelector('.buy__submit-btn');
    var submitInputs = Array.from(formElem.querySelectorAll('input'));

    if (window.basket.goods < 1) {
      submitBtnElem.disabled = true;
      submitInputs.forEach(function (input) {
        input.disabled = true;
      });
    } else {
      submitBtnElem.disabled = false;
      submitInputs.forEach(function (input) {
        input.disabled = false;
      });
    }
  };

  // смена способа доставки
  var changeDeliveryMethod = function () {
    var toggleBtnElem = document.querySelector('.deliver__toggle');

    var delivery = {};
    delivery[STORE] = document.querySelector('.' + STORE);
    delivery[COURIER] = document.querySelector('.' + COURIER);

    toggleBtnElem.addEventListener('change', function (evt) {
      onToggleBtnElemChange(evt.target, STORE, COURIER, delivery);
    });
  };

  // смена способа оплаты
  var changePaymentMethod = function () {
    var toggleBtnElem = document.querySelector('.payment__method');

    var payment = {};
    payment[CARD] = document.querySelector('.' + CARD + '-wrap');
    payment[CASH] = document.querySelector('.' + CASH + '-wrap');

    toggleBtnElem.addEventListener('change', function (evt) {
      onToggleBtnElemChange(evt.target, CARD, CASH, payment);
    });
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

  // смена картинки карты при выборе станции метро
  var changeMapImage = function () {
    var deliverStoreListElem = document.querySelector('.deliver__store-list');
    var mapImageElem = document.querySelector('.deliver__store-map-img');
    var storeAdressElem = document.querySelector('.deliver__store-describe');

    deliverStoreListElem.addEventListener('change', function (evt) {
      if (evt.target.name === 'store') {
        var picture = MapImage.PATH + evt.target.value + MapImage.EXTENSION;
        mapImageElem.src = picture;
        mapImageElem.alt = evt.target.value;
        storeAdressElem.textContent = storeNameToAdress[evt.target.value];
      }
    });
  };

  // отключает/включает fieldset внутри конкретного враппера
  var disableFieldset = function (wrapper) {
    var fieldset = wrapper.querySelector('fieldset');
    if (fieldset) {
      fieldset.disabled = !fieldset.disabled;
    }
  };

  // валидация полей ввода
  var toPassInputsValidation = function () {
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

    // смена статуса карты
    var cardStatus = document.querySelector('.payment__card-status');
    var changeCardStatus = function () {
      var isAllValid = window.utils.checkByluhnAlgorithm(cardNumberElem) === true && cardNumberElem.validity.valid && cardExpiresElem.validity.valid && cardCvcElem.validity.valid && holderName.validity.valid;
      cardStatus.textContent = isAllValid ? 'Одобрен' : 'Не определен';
    };
  };

  // очистка всех полей
  var cleanAllInputs = function () {
    var dirtyInputs = formElem.querySelectorAll('input');
    dirtyInputs.forEach(function (input) {
      input.value = '';
    });
  };

  // отправка формы заказа
  var submitForm = function () {
    var onSuccessUpload = function () {
      window.backend.displayModal(true);
      window.basket.clean();
      cleanAllInputs();
      setupSubmition();
    };

    // обработчик отправки формы
    formElem.addEventListener('submit', function (evt) {
      evt.preventDefault();
      window.backend.upload(new FormData(formElem), onSuccessUpload, window.error.onErrorUpload);
    });
  };

  changeDeliveryMethod();
  changeMapImage();
  changePaymentMethod();
  toPassInputsValidation();
  submitForm();

  window.order.setupSubmition = setupSubmition;
})();
