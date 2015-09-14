describe('indexedDBAdapter', function() {

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
    expect(indexedDBAdapter).not.to.be(undefined);
  });

  describe('interface', function() {
    it('should have a "get" function defined', function() {
      expect(indexedDBAdapter.get).not.to.be(undefined);
      expect(typeof(indexedDBAdapter.get)).to.eql('function');
    });

    it('should have a "set" function defined', function() {
      expect(indexedDBAdapter.set).not.to.be(undefined);
      expect(typeof(indexedDBAdapter.set)).to.eql('function');
    });

    it('should have a "remove" function defined', function() {
      expect(indexedDBAdapter.remove).not.to.be(undefined);
      expect(typeof(indexedDBAdapter.remove)).to.eql('function');
    });

    it('should have a "clear" function defined', function() {
      expect(indexedDBAdapter.clear).not.to.be(undefined);
      expect(typeof(indexedDBAdapter.clear)).to.eql('function');
    });
  });

  describe('implementation', function() {
    it('isValid should be true', function() {
      expect(indexedDBAdapter.isValid).to.eql(true);
    });

    it('set(key, value, callback)', function(done) {
      indexedDBAdapter.set(uuid(), 'foo', function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });

    it('get(key, callback)', function(done) {
      indexedDBAdapter.get(uuid(), function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });

    it('clear(callback)', function(done) {
      indexedDBAdapter.clear(function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });

    it('remove(key, callback)', function(done) {
      indexedDBAdapter.remove(uuid(), function(e, r) {
        expect(e).to.be(null);
        done();
      });
    });
  });

  describe('integration', function() {
    it('set and get a key/value pair', function(done) {
      key = uuid();
      value = 'foo';

      indexedDBAdapter.set(key, value, function(e, r) {
        indexedDBAdapter.get(key, function(e, r) {
          expect(r).not.to.be(undefined);
          expect(r).to.eql(value);
          done();
        });
      });
    });

    it('update an existing key/value pair', function(done) {
      key = uuid();
      value = 'foo';

      indexedDBAdapter.set(key, value, function(e, r) {
        indexedDBAdapter.get(key, function(e, r) {
          expect(r).not.to.be(undefined);
          expect(r).to.eql(value);

          indexedDBAdapter.set(key, 'bar', function(e, r) {
            expect(e).to.be(null);

            indexedDBAdapter.get(key, function(e, r) {
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

      indexedDBAdapter.set(key, value, function(e, r) {
        indexedDBAdapter.remove(key, function(e, r) {
          expect(e).to.be(null);

          // verify the pair is gone
          indexedDBAdapter.get(key, function(e, r) {
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

      indexedDBAdapter.set(key1, value, function(e, r) {
        indexedDBAdapter.set(key2, value, function(e, r) {
          indexedDBAdapter.clear(function(e, r) {
            expect(e).to.be(null);

            // verify that the pairs are gone
            indexedDBAdapter.get(key1, function(e, r) {
              expect(r).to.be(undefined);

              indexedDBAdapter.get(key2, function(e, r) {
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
