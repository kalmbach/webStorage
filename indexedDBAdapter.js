"use strict";

var indexedDBAdapter = (function() {
  var publicAPI = {};

  publicAPI.db = undefined;
  publicAPI.isValid = false;
  publicAPI.tableName = "store";

  publicAPI.errorHandler = function(callback) {
    return function(error) {
      if (typeof(callback) === "function") {
        callback(error);
      }
    };
  }

  publicAPI.okHandler = function(callback) {
    return function(tx, results) {
      var data;

      if (typeof(callback) === "function") {
        if (results.rows.length > 0) {
          data = JSON.parse(results.rows.item(0).value);
        }

        callback(null, data);
      }
    };
  }

  publicAPI.clear = function(callback) {
    var self = this;

    if (this.isValid) {
      this.db.transaction(
        function(t) {
          var query = "DELETE FROM " + self.tableName + ";";
          t.executeSql(query, [], self.okHandler(callback)); 
        },
        this.errorHandler(callback)
      );
    }
  }

  publicAPI.get = function(key, callback) {
    var self = this;

    if (this.isValid) {
      this.db.readTransaction(
        function(t) {
          var query = "SELECT key,value FROM " + self.tableName + " WHERE key=?;";
          t.executeSql(query, [key], self.okHandler(callback));
        },
        this.errorHandler(callback)
      );
    }
  }

  publicAPI.set = function(key, value, callback) {
    var self = this;

    if (this.isValid) {
      this.db.transaction(
        function(t) {
          var delete_query = "DELETE FROM " + self.tableName + " WHERE key=?;";
          var insert_query = "INSERT INTO " + self.tableName + "(key,value) VALUES(?,?);";
          var data = JSON.stringify(value);

          t.executeSql(delete_query, [key], function(e, r) {
            t.executeSql(insert_query, [key, data], self.okHandler(callback));
          });
        },
        this.errorHandler(callback)
      );
    }
  }

  publicAPI.remove = function(key, callback) {
    var self = this;

    if (this.isValid) {
      this.db.transaction(
        function(t) {
          var query = "DELETE FROM " + self.tableName + " WHERE key=?;";
          t.executeSql(query, [key], self.okHandler(callback));
        },
        this.errorHandler(callback)
      );
    }
  }

  function init() {
    var self = this;

    if ('indexedDB' in window && window.indexedDB !== undefined) {
      var request = indexedDB.open('_webStorage', 1);
      request.onerror = function(event) { self.isValid = false; }
      request.onsuccess = function(event) {
        self.db = event.target.result;
        self.isValid = true;
      }
    } else {
      this.isValid = false;
    }
  }

  init.call(publicAPI);

  return publicAPI;
})();
