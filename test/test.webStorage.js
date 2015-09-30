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


var adapters = [localStorageAdapter, webSQLAdapter, indexedDBAdapter];
var iterator = 0;

function suite(subject, callback) {
  describe(subject.name, function() {
    it('should be defined', function() {
      expect(subject).not.to.be(undefined);
    });

    it('should be valid', function() {
      expect(subject.isValid).to.be(true);
    });

    describe('interface', function() {
      it('should have a "get" function defined', function() {
        expect(subject.get).not.to.be(undefined);
        expect(typeof(subject.get)).to.eql('function');
      });

      it('should have a "set" function defined', function() {
        expect(subject.set).not.to.be(undefined);
        expect(typeof(subject.set)).to.eql('function');
      });

      it('should have a "remove" function defined', function() {
        expect(subject.remove).not.to.be(undefined);
        expect(typeof(subject.remove)).to.eql('function');
      });

      it('should have a "clear" function defined', function() {
        expect(subject.clear).not.to.be(undefined);
        expect(typeof(subject.clear)).to.eql('function');
      });

      it('should have a "length" function defined', function() {
        expect(subject.length).not.to.be(undefined);
        expect(typeof(subject.length)).to.eql('function');
      });

      it('should have a "key" function defined', function() {
        expect(subject.key).not.to.be(undefined);
        expect(typeof(subject.key)).to.eql('function');
      });
    });

    describe('implementation', function() {
      beforeEach(function(done) {
        subject.clear(function(e, r) { done(); });
      });

      it('set(key, value, callback)', function(done) {
        subject.set(uuid(), 'foo', function(e, r) {
          expect(e).to.be(null);

          subject.length(function(e, r) {
            expect(e).to.be(null);
            expect(r).to.be(1);

            done();
          });
        });
      });

      it('get(key, callback)', function(done) {
        var key = uuid();

        subject.set(key, 'foo', function(e, r) {
          expect(e).to.be(null);

          subject.get(key, function(e, r) {
            expect(e).to.be(null);
            expect(r).to.be('foo');

            done();
          });
        });
      });

      it('clear(callback)', function(done) {
        var key = uuid();

        subject.set(key, 'foo', function(e, r) {
          expect(e).to.be(null);

          subject.clear(function(e, r) {
            expect(e).to.be(null);

            subject.get(key, function(e, r) {
              expect(e).to.be(null);
              expect(r).to.be(undefined);

              subject.length(function(e, r) {
                expect(e).to.be(null);
                expect(r).to.be(0);

                done();
              });
            });
          });
        });
      });

      it('remove(key, callback)', function(done) {
        var key = uuid();

        subject.set(key, 'foo', function(e, r) {
          expect(e).to.be(null);

          subject.remove(key, function(e, r) {
            expect(e).to.be(null);

            subject.length(function(e, r) {
              expect(e).to.be(null);
              expect(r).to.be(0);

              done();
            });
          });
        });
      });

      it('length(callback)', function(done) {
        subject.length(function(e, r) {
          expect(e).to.be(null);
          expect(r).to.be(0);

          subject.set(uuid(), 'foo', function(e, r) {
            expect(e).to.be(null);

            subject.length(function(e, r) {
              expect(e).to.be(null);
              expect(r).to.be(1);

              subject.set(uuid(), 'foo', function(e, r) {
                expect(e).to.be(null);

                subject.length(function(e, r) {
                  expect(e).to.be(null);
                  expect(r).to.be(2);

                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  callback();
}

(function runSuite() {
  if (iterator < adapters.length) {
    suite(adapters[iterator++], runSuite)
  };
})()
