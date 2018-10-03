'use strict';

(function () {
  window.utils = {
    getRandomNum: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomInd: function (array) {
      return window.utils.getRandomNum(0, array.length - 1);
    },
    getRandomBool: function () {
      return Math.random() < 0.5;
    },

    // склоняет окончание слова в зависимости от числа
    declOfNum: function (number, titles) {
      var cases = [2, 0, 1, 1, 1, 2];
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    },

    // алгоритм Луна
    luhnAlgorithm: function (cardNumber) {
      var array = cardNumber.value.split('');
      var sum = 0;
      array.toString();
      for (var i = 0; i < array.length; i++) {
        var parsedNum = parseInt(array[i], 10);
        if (i % 2 === 0) {
          var increased = parsedNum *= 2;
          parsedNum = (increased > 9) ? increased -= 9 : increased;
        }
        sum += parsedNum;
      }
      return (sum % 10) === 0;
    }
  };
})();
