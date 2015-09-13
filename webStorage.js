"use strict";

var webStorage = (function() {
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
    this.db = undefined;

    if (!window.openDatabase) {
      this.isValid = false;
      Object.freeze(this);
    } else {
      this.db = openDatabase('_webStorage', '1.0', 'Web Storage', 2 * 1024 * 1024);
      this.db.transaction(
        function(t) {
          t.executeSql("CREATE TABLE IF NOT EXISTS store(key STRING, value TEXT)");
        },
        function(e) {
          self.isValid = false;
          Object.freeze(self);
        },
        function() {
          self.isValid = true;
          Object.freeze(self);
        }
      );
    }
  }

  init.call(publicAPI);

  return publicAPI;
})();
