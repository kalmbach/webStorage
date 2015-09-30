"use strict";

var localStorageAdapter = (function() {
  var publicAPI = {};

  publicAPI.name = "localStorageAdapter";
  publicAPI.isValid = false;

  publicAPI.errorHandler = function(error, callback) {
    if (typeof(callback) === "function") {
      callback(error);
    }
  }

  publicAPI.okHandler = function(data, callback) {
    var value;

    if (typeof(callback) === "function") {
      if (data !== null && data !== undefined) {
        value = JSON.parse(data);
      }
      callback(null, value);
    }
  }

  publicAPI.clear = function(callback) {
    if (this.isValid) {
      try {
        localStorage.clear();
        this.okHandler(null, callback);
      } catch(e) {
        this.errorHandler(e, callback);
      }
    }
  }

  publicAPI.get = function(key, callback) {
    if (this.isValid) {
      try {
        var value = localStorage.getItem(key);
        this.okHandler(value, callback);
      } catch(e) {
        this.errorHandler(e, callback);
      }
    }
  }

  publicAPI.set = function(key, value, callback) {
    if (this.isValid) {
      try {
        var data = JSON.stringify(value);
        localStorage.setItem(key, data);
        this.okHandler(null, callback);
      } catch(e) {
        this.errorHandler(e, callback);
      }
    }
  }

  publicAPI.remove = function(key, callback) {
    if (this.isValid) {
      try {
        localStorage.removeItem(key);
        this.okHandler(null, callback);
      } catch(e) {
        this.errorHandler(e, callback);
      }
    }
  }

  publicAPI.length = function(callback) {
    if (this.isValid) {
      try {
        var length = JSON.stringify(localStorage.length);
        this.okHandler(length, callback);
      } catch(e) {
        this.errorHandler(e, callback);
      }
    }
  }

  publicAPI.key = function(n, callback) {
  }

  function init() {
    try {
      this.isValid = 'localStorage' in window && window['localStorage'] !== null;
    } catch(e) {
      this.isValid = false;
    }
  }

  init.call(publicAPI);

  return publicAPI;
})();
