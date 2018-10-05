'use strict';

(function () {
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

  var possibleErrorsMap = [{
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

  var errTitle = window.backend.Modal.ERROR.querySelector('.modal__title');
  var errMsg = window.backend.Modal.ERROR.querySelector('.modal__message');

  // в случае ошибки
  var onErrorUpload = function (errorMessage, status) {
    window.backend.displayModal(false);
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
    var error = possibleErrorsMap.find(findByStatus);
    if (error) {
      return error.text;
    }
    return 'Неизвестная ошибка';
  };

  window.error = {
    Code: Code,
    onErrorUpload: onErrorUpload,
    findErrorText: findErrorText
  };

})();
