'use strict';

(function () {
  var URL_POST = 'https://js.dump.academy/candyshop';
  var URL_GET = 'https://js.dump.academy/candyshop/data';
  var TIMEOUT = 10000;
  var Code = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATAWAY: 502,
    SERVICE_UNAVAIL: 503
  };

  var PossibleErrors = [{
    status: Code.BAD_REQUEST,
    text: 'Неверный запрос'
  },
  {
    status: Code.UNAUTHORIZED,
    text: 'Пройдите авторизацию на сайте'
  },
  {
    status: Code.FORBIDDEN,
    text: 'Нет прав на просмотр информации'
  },
  {
    status: Code.NOT_FOUND,
    text: 'Не найдено, проверьте адрес запроса'
  },
  {
    status: Code.INTERNAL_SERVER_ERROR,
    text: 'Внутренняя ошибка сервера'
  },
  {
    status: Code.BAD_GATAWAY,
    text: 'Ошибочный шлюз'
  },
  {
    status: Code.SERVICE_UNAVAIL,
    text: 'Сервис недоступен'
  }
  ];

  var Modal = {
    SUCCESS: document.querySelector('.modal--success'),
    ERROR: document.querySelector('.modal--error')
  };

  var errTitle = Modal.ERROR.querySelector('.modal__title');
  var errMsg = Modal.ERROR.querySelector('.modal__message');

  // отображает модальное окно
  var displayModal = function (isSuccess) {
    var ModalElem = (isSuccess) ? Modal.SUCCESS : Modal.ERROR;
    var modalCloseElem = ModalElem.querySelector('.modal__close');

    ModalElem.classList.remove('modal--hidden');

    modalCloseElem.addEventListener('click', function () {
      ModalElem.classList.add('modal--hidden');
    });
  };

  // в случае ошибки
  var onErrorUpload = function (errorMessage, status) {
    displayModal(false);
    errTitle.textContent = errorMessage;
    if (status) {
      errMsg.textContent = 'Код ошибки: ' + status;
    }
  };

  // ищет текст ошибки по статусу
  var findErrorText = function (status) {
    var findByStatus = function (obj) {
      return obj.status === status;
    };
    var error = PossibleErrors.find(findByStatus);
    if (error) {
      return error.text;
    }
    return 'Неизвестная ошибка';
  };


  window.backend = {

    onErrorUpload: onErrorUpload,
    displayModal: displayModal,

    // выгрузка на сервер
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === Code.OK) {
          onLoad(xhr.response);
        } else {
          onError(findErrorText(xhr.status), xhr.status);
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
      xhr.open('POST', URL_POST);
      xhr.send(data);
    },

    // загрузка на сервер
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === Code.OK) {
          onLoad(xhr.response);
        } else {
          onError(findErrorText(xhr.status), xhr.status);
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

      xhr.timeout = TIMEOUT; // 10s

      xhr.open('GET', URL_GET);
      xhr.send();
    }
  };
})();
