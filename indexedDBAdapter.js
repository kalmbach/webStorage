"use strict";

var indexedDBAdapter = (function() {
  var publicAPI = {};

  publicAPI.db = undefined;
  publicAPI.isValid = false;
  publicAPI.storeName = "store";

  publicAPI.clear = function(callback) {
    var self = this;

    if (this.isValid) {
      var transaction = this.db.transaction([this.storeName], 'readwrite');
      var objectStore = transaction.objectStore(this.storeName);
      var request = objectStore.clear();

      request.onsuccess = function(event) {
        if (typeof(callback) === "function") {
          callback(null);
        }
      };

      request.onerror = function (event) {
        if (typeof(callback) === "function") {
          callback(event);
        }
      };
    }
  }

  publicAPI.get = function(key, callback) {
    var self = this;

    if (this.isValid) {
      var transaction = this.db.transaction([this.storeName], "readonly");
      var objectStore = transaction.objectStore(this.storeName);
      var request = objectStore.get(key);

      request.onerror = function(event) {
        if (typeof(callback) === "function") {
          callback(event);
        }
      };

      request.onsuccess = function(event) {
        if (typeof(callback) === "function") {
          var data;

          if (this.result) {
            data = JSON.parse(this.result.value);
          }

          callback(null, data);
        }
      };
    }
  }

  publicAPI.set = function(key, value, callback) {
    console.log("Store: " + this.storeName);
    if (this.isValid) {
      var transaction = this.db.transaction([this.storeName], "readwrite")
      var objectStore = transaction.objectStore(this.storeName)
      var deleteRequest = objectStore.delete(key)

      deleteRequest.onsuccess = function(event) {
        var addRequest = objectStore.add({ key: key, value: JSON.stringify(value) })

        addRequest.onsuccess = function(event) {
          if (typeof(callback) === "function") {
            callback(null);
          }
        };

        addRequest.onerror = function(event) {
          if (typeof(callback) === "function") {
            callback(event);
          }
        };
      }
    }
  }

  publicAPI.remove = function(key, callback) {
    var self = this;

    if (this.isValid) {
      var transaction = this.db.transaction([this.storeName], "readwrite")
      var objectStore = transaction.objectStore(this.storeName)
      var request = objectStore.delete(key)

      request.onsuccess = function(event) {
        if (typeof(callback) === "function") {
          callback(null);
        }
      };

      request.onerror = function(event) {
        if (typeof(callback) === "function") {
          callback(event);
        }
      };
    }
  }

  function init() {
    var self = this;

    if ('indexedDB' in window && window.indexedDB !== undefined) {
      var request = indexedDB.open('_webStorage', 1);

      request.onsuccess = function(event) {
        self.db = this.result;
        self.isValid = true;
      }

      request.onupgradeneeded = function(event) {
        var db = this.result;

        var objectStore = db.createObjectStore(self.storeName, { keyPath: "key" });
        objectStore.createIndex("key", "key", { unique: true });
      }

      request.onerror = function(event) {
        self.isValid = true;
      }
    } else {
      this.isValid = false;
    }
  }

  init.call(publicAPI);

  return publicAPI;
})();
