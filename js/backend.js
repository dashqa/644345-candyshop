'use strict';

(function () {
  var Url = {
    POST: 'https://js.dump.academy/candyshop',
    GET: 'https://js.dump.academy/candyshop/data'
  }

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

  var getXhrRequest = function (method, url, data, onLoad, onError) {
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
    xhr.open(method, url);

    xhr.send(data || null);
    return xhr;
  };


  window.backend = {
    Modal: Modal,
    displayModal: displayModal,

    // выгрузка на сервер
    upload: function (data, onLoad, onError) {
      getXhrRequest('POST', Url.POST, data, onLoad, onError);
    },

    // загрузка на сервер
    load: function (onLoad, onError) {
      getXhrRequest('GET', Url.GET, null, onLoad, onError);
    }
  };
})();
