'use strict';

(function () {
  var Url = {
    POST: 'https://js.dump.academy/candyshop',
    GET: 'https://js.dump.academy/candyshop/data'
  };

  var TIMEOUT = 10000;

  var Modal = {
    SUCCESS: document.querySelector('.modal--success'),
    ERROR: document.querySelector('.modal--error')
  };

  // отображает модальное окно
  var displayModal = function (isSuccess) {
    var ModalElem = (isSuccess) ? Modal.SUCCESS : Modal.ERROR;
    var modalCloseElem = ModalElem.querySelector('.modal__close');

    ModalElem.classList.remove('modal--hidden');

    modalCloseElem.addEventListener('click', function () {
      ModalElem.classList.add('modal--hidden');
    });
  };

  var getXhrRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.error.Code.OK) {
        onLoad(xhr.response);
      } else {
        onError(window.error.findErrorText(xhr.status), xhr.status);
      }
    });

    xhr.addEventListener('abort', function () {
      onError('Загрузка данных была прервана');
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = TIMEOUT;
    return xhr;
  };


  window.backend = {
    Modal: Modal,
    displayModal: displayModal,

    // выгрузка на сервер
    upload: function (data, onLoad, onError) {
      var xhr = getXhrRequest(onLoad, onError);
      xhr.open('POST', Url.POST);
      xhr.send(data);
    },

    // загрузка на сервер
    load: function (onLoad, onError) {
      var xhr = getXhrRequest(onLoad, onError);
      xhr.open('GET', Url.GET);
      xhr.send();
    }
  };
})();
