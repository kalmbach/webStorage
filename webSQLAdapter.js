"use strict";

var webSQLAdapter = (function() {
  var publicAPI = {};

  publicAPI.name = "webSQLAdapter";
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
    if (this.isValid) {
      this.db.transaction(
        (function (t) {
          var query = "DELETE FROM " + this.tableName + ";";
          t.executeSql(query, [], this.okHandler(callback));
        }).bind(this),
        this.errorHandler(callback)
      );
    }
  }

  publicAPI.get = function(key, callback) {
    if (this.isValid) {
      this.db.readTransaction(
        (function(t) {
          var query = "SELECT key,value FROM " + this.tableName + " WHERE key=?;";
          t.executeSql(query, [key], this.okHandler(callback));
        }).bind(this),
        this.errorHandler(callback)
      );
    }
  }

  publicAPI.set = function(key, value, callback) {
    if (this.isValid) {
      this.db.transaction(
        (function(t) {
          var delete_query = "DELETE FROM " + this.tableName + " WHERE key=?;";
          var insert_query = "INSERT INTO " + this.tableName + "(key,value) VALUES(?,?);";
          var data = JSON.stringify(value);

          t.executeSql(delete_query, [key], (function(e, r) {
            t.executeSql(insert_query, [key, data], this.okHandler(callback));
          }).bind(this));
        }).bind(this),
        this.errorHandler(callback)
      );
    }
  }

  publicAPI.remove = function(key, callback) {
    if (this.isValid) {
      this.db.transaction(
        (function(t) {
          var query = "DELETE FROM " + this.tableName + " WHERE key=?;";
          t.executeSql(query, [key], this.okHandler(callback));
        }).bind(this),
        this.errorHandler(callback)
      );
    }
  }

  publicAPI.length = function(callback) {
    if (this.isValid) {
      this.db.transaction(
        (function(t) {
          var query = "SELECT COUNT(*) AS value FROM " + this.tableName + ";";
          t.executeSql(query, [], this.okHandler(callback));
        }).bind(this),
        this.errorHandler(callback)
      );
    }
  }

  publicAPI.key = function(n, callback) {

  }

  function init() {
    this.db = undefined;

    if ('openDatabase' in window && window.openDatabase !== undefined) {
      this.db = openDatabase('_webStorage', '1.0', 'Web Storage', 2 * 1024 * 1024);
      this.db.transaction(
        function(t) {
          t.executeSql("CREATE TABLE IF NOT EXISTS store(key STRING, value TEXT)");
        },
        (function(e) { this.isValid = false; }).bind(this),
        (function() { this.isValid = true; }).bind(this)
      );
    } else {
      this.isValid = false;
    }
  }

  init.call(publicAPI);

  return publicAPI;
})();
