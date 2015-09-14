describe('localStorageAdapter', function() {

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
    expect(localStorageAdapter).not.to.be(undefined);
  });

  describe('interface', function() {
    it('should have a "get" function defined', function() {
      expect(localStorageAdapter.get).not.to.be(undefined);
      expect(typeof(localStorageAdapter.get)).to.eql('function');
    });

    it('should have a "set" function defined', function() {
      expect(localStorageAdapter.set).not.to.be(undefined);
      expect(typeof(localStorageAdapter.set)).to.eql('function');
    });

    it('should have a "remove" function defined', function() {
      expect(localStorageAdapter.remove).not.to.be(undefined);
      expect(typeof(localStorageAdapter.remove)).to.eql('function');
    });

    it('should have a "clear" function defined', function() {
      expect(localStorageAdapter.clear).not.to.be(undefined);
      expect(typeof(localStorageAdapter.clear)).to.eql('function');
    });
  });

  describe('implementation', function() {
    it('isValid should be true', function() {
      expect(localStorageAdapter.isValid).to.eql(true);
    });

    it('set(key, value, callback)', function(done) {
      localStorageAdapter.set(uuid(), 'foo', function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });

    it('get(key, callback)', function(done) {
      localStorageAdapter.get(uuid(), function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });

    it('clear(callback)', function(done) {
      localStorageAdapter.clear(function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });

    it('remove(key, callback)', function(done) {
      localStorageAdapter.remove(uuid(), function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });
  });

  describe('integration', function() {
    it('set and get a key/value pair', function(done) {
      key = uuid();
      value = 'foo';

      localStorageAdapter.set(key, value, function(e, r) {
        localStorageAdapter.get(key, function(e, r) {
          expect(r).not.to.be(undefined);
          expect(r).to.eql(value);
          done();
        });
      });
    });

    it('update an existing key/value pair', function(done) {
      key = uuid();
      value = 'foo';

      localStorageAdapter.set(key, value, function(e, r) {
        localStorageAdapter.get(key, function(e, r) {
          expect(r).not.to.be(undefined);
          expect(r).to.eql(value);

          localStorageAdapter.set(key, 'bar', function(e, r) {
            expect(e).to.be(null);

            localStorageAdapter.get(key, function(e, r) {
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

      localStorageAdapter.set(key, value, function(e, r) {
        localStorageAdapter.remove(key, function(e, r) {
          expect(e).to.be(null);

          // verify the pair is gone
          localStorageAdapter.get(key, function(e, r) {
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

      localStorageAdapter.set(key1, value, function(e, r) {
        localStorageAdapter.set(key2, value, function(e, r) {
          localStorageAdapter.clear(function(e, r) {
            expect(e).to.be(null);

            // verify that the pairs are gone
            localStorageAdapter.get(key1, function(e, r) {
              expect(r).to.be(undefined);

              localStorageAdapter.get(key2, function(e, r) {
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
