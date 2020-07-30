describe('Asymmetric equality testers (Integration)', function () {
  function verifyPasses(expectations, setup) {
    it('passes', function (done) {
      var env = new jasmineUnderTest.Env();
      env.it('a spec', function () {
        expectations(env);
      });

      var specExpectations = function (result) {
        expect(result.status).toEqual('passed');
        expect(result.passedExpectations.length)
          .withContext('Number of passed expectations')
          .toEqual(1);
        expect(result.failedExpectations.length)
          .withContext('Number of failed expectations')
          .toEqual(0);
        expect(result.failedExpectations[0] && result.failedExpectations[0].message)
          .withContext('Failure message')
          .toBeUndefined();
      };

      env.addReporter({specDone: specExpectations, jasmineDone: done});
      env.execute();
    });
  }

  function verifyFails(expectations) {
    it('fails', function (done) {
      var env = new jasmineUnderTest.Env();
      env.it('a spec', function () {
        expectations(env);
      });

      var specExpectations = function (result) {
        expect(result.status).toEqual('failed');
        expect(result.failedExpectations.length)
          .withContext('Number of failed expectations')
          .toEqual(1);
        expect(result.failedExpectations[0].message)
          .withContext('Failed with a thrown error rather than a matcher failure')
          .not.toMatch(/^Error: /);
        expect(result.failedExpectations[0].matcherName).withContext('Matcher name')
          .not.toEqual('');
      };

      env.addReporter({specDone: specExpectations, jasmineDone: done});
      env.execute();
    });
  }

  describe('any', function () {
    verifyPasses(function (env) {
      env.expect(5).toEqual(jasmineUnderTest.any(Number));
    });

    verifyFails(function (env) {
      env.expect("five").toEqual(jasmineUnderTest.any(Number));
    });
  });

  describe('anything', function () {
    verifyPasses(function (env) {
      env.expect('').toEqual(jasmineUnderTest.anything());
    });

    verifyFails(function (env) {
      env.expect(null).toEqual(jasmineUnderTest.anything());
    });
  });

  describe('arrayContaining', function () {
    verifyPasses(function (env) {
      env.addCustomEqualityTester(function (a, b) {
        return a.toString() === b.toString();
      });
      env.expect([1, 2, 3]).toEqual(jasmineUnderTest.arrayContaining(["2"]));
    });

    verifyFails(function (env) {
      env.expect(null).toEqual(jasmineUnderTest.arrayContaining([2]));
    });
  });

  describe('arrayWithExactContents', function () {
    verifyPasses(function (env) {
      env.addCustomEqualityTester(function (a, b) {
        return a.toString() === b.toString();
      });
      env.expect([1, 2]).toEqual(jasmineUnderTest.arrayWithExactContents(["2", "1"]));
    });

    verifyFails(function (env) {
      env.expect([]).toEqual(jasmineUnderTest.arrayWithExactContents([2]));
    });
  });

  describe('empty', function () {
    verifyPasses(function (env) {
      env.expect([]).toEqual(jasmineUnderTest.empty());
    });

    verifyFails(function (env) {
      env.expect([1]).toEqual(jasmineUnderTest.empty());
    });
  });

  describe('falsy', function () {
    verifyPasses(function (env) {
      env.expect(false).toEqual(jasmineUnderTest.falsy());
    });

    verifyFails(function (env) {
      env.expect(true).toEqual(jasmineUnderTest.falsy());
    });
  });

  describe('mapContaining', function () {
    if (jasmine.getEnv().hasFunctioningMaps()) {
      verifyPasses(function (env) {
        var actual = new Map();
        actual.set('a', "2");
        var expected = new Map();
        expected.set('a', 2);

        env.addCustomEqualityTester(function (a, b) {
          return a.toString() === b.toString();
        });

        env.expect(actual).toEqual(jasmineUnderTest.mapContaining(expected));
      });
    } else {
      it('passes', function() {
        jasmine.getEnv().pending('Browser has incomplete or missing support for Maps');
      });
    }

    if (jasmine.getEnv().hasFunctioningMaps()) {
      verifyFails(function (env) {
        env.expect('something').toEqual(jasmineUnderTest.mapContaining(new Map()));
      });
    } else {
      it('fails', function() {
        jasmine.getEnv().pending('Browser has incomplete or missing support for Maps');
      });
    }
  });

  describe('notEmpty', function () {
    verifyPasses(function (env) {
      env.expect([1]).toEqual(jasmineUnderTest.notEmpty());
    });

    verifyFails(function (env) {
      env.expect([]).toEqual(jasmineUnderTest.notEmpty());
    });
  });

  describe('objectContaining', function () {
    verifyPasses(function (env) {
      env.addCustomEqualityTester(function (a, b) {
        return a.toString() === b.toString();
      });

      env.expect({a: 1, b: 2}).toEqual(jasmineUnderTest.objectContaining({a: "1"}));
    });

    verifyFails(function (env) {
      env.expect({}).toEqual(jasmineUnderTest.objectContaining({a: "1"}));
    });
  });

  describe('setContaining', function () {
    if (jasmine.getEnv().hasFunctioningSets()) {
      verifyPasses(function (env) {
        var actual = new Set();
        actual.add("1");
        var expected = new Set();
        actual.add(1);

        env.addCustomEqualityTester(function (a, b) {
          return a.toString() === b.toString();
        });

        env.expect(actual).toEqual(jasmineUnderTest.setContaining(expected));
      });
    } else {
      it('pases', function() {
        jasmine.getEnv().pending('Browser has incomplete or missing support for Sets');
      });
    }

    if (jasmine.getEnv().hasFunctioningSets()) {
      verifyFails(function (env) {
        env.expect('something').toEqual(jasmineUnderTest.setContaining(new Set()));
      });
    } else {
      it('fails', function() {
        jasmine.getEnv().pending('Browser has incomplete or missing support for Sets');
      });
    }
  });

  describe('stringMatching', function () {
    verifyPasses(function (env) {
      env.expect('foo').toEqual(jasmineUnderTest.stringMatching(/o/));
    });

    verifyFails(function (env) {
      env.expect('bar').toEqual(jasmineUnderTest.stringMatching(/o/));
    });
  });

  describe('truthy', function () {
    verifyPasses(function (env) {
      env.expect(true).toEqual(jasmineUnderTest.truthy());
    });

    verifyFails(function (env) {
      env.expect(false).toEqual(jasmineUnderTest.truthy());
    });
  });
});
