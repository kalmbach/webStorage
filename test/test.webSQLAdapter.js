describe('webSQLAdapter', function() {

  // used to generate random keys
  function uuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  }

  it('should be defined', function() {
    expect(webSQLAdapter).not.to.be(undefined);
  });

  describe('interface', function() {
    it('should have a "get" function defined', function() {
      expect(webSQLAdapter.get).not.to.be(undefined);
      expect(typeof(webSQLAdapter.get)).to.eql('function');
    });

    it('should have a "set" function defined', function() {
      expect(webSQLAdapter.set).not.to.be(undefined);
      expect(typeof(webSQLAdapter.set)).to.eql('function');
    });

    it('should have a "remove" function defined', function() {
      expect(webSQLAdapter.remove).not.to.be(undefined);
      expect(typeof(webSQLAdapter.remove)).to.eql('function');
    });

    it('should have a "clear" function defined', function() {
      expect(webSQLAdapter.clear).not.to.be(undefined);
      expect(typeof(webSQLAdapter.clear)).to.eql('function');
    });
  });

  describe('implementation', function() {
    it('isValid should be true', function() {
      expect(webSQLAdapter.isValid).to.eql(true);
    });

    it('set(key, value, callback)', function(done) {
      webSQLAdapter.set(uuid(), 'foo', function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });

    it('get(key, callback)', function(done) {
      webSQLAdapter.get(uuid(), function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });

    it('clear(callback)', function(done) {
      webSQLAdapter.clear(function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });

    it('remove(key, callback)', function(done) {
      webSQLAdapter.remove(uuid(), function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });
  });

  describe('integration', function() {
    it('set and get a key/value pair', function(done) {
      key = uuid();
      value = 'foo';

      webSQLAdapter.set(key, value, function(e, r) {
        webSQLAdapter.get(key, function(e, r) {
          expect(r).not.to.be(undefined);
          expect(r).to.eql(value);
          done();
        });
      });
    });

    it('update an existing key/value pair', function(done) {
      key = uuid();
      value = 'foo';

      webSQLAdapter.set(key, value, function(e, r) {
        webSQLAdapter.get(key, function(e, r) {
          expect(r).not.to.be(undefined);
          expect(r).to.eql(value);

          webSQLAdapter.set(key, 'bar', function(e, r) {
            expect(e).to.be(null);

            webSQLAdapter.get(key, function(e, r) {
              expect(r).to.eql('bar');
              done();
            });
          });
        });
      });
    });

    it('remove a key/value pair', function(done) {
      key = uuid();
      value = 'foo';

      webSQLAdapter.set(key, value, function(e, r) {
        webSQLAdapter.remove(key, function(e, r) {
          expect(e).to.be(null);

          // verify the pair is gone
          webSQLAdapter.get(key, function(e, r) {
            expect(r).to.be(undefined);
            done();
          });
        });
      });
    });

    it('clear the entire store', function(done) {
      key1 = uuid();
      key2 = uuid();
      value = 'foo';

      webSQLAdapter.set(key1, value, function(e, r) {
        webSQLAdapter.set(key2, value, function(e, r) {
          webSQLAdapter.clear(function(e, r) {
            expect(e).to.be(null);

            // verify that the pairs are gone
            webSQLAdapter.get(key1, function(e, r) {
              expect(r).to.be(undefined);

              webSQLAdapter.get(key2, function(e, r) {
                expect(r).to.be(undefined);
                done();
              });
            });
          });
        });
      });
    });
  });
});
