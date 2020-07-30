describe('SetContaining', function() {
  function SetI(iterable) {    // for IE11
    var set = new Set();
    iterable.forEach(function(v) {
      set.add(v);
    });
    return set;
  }

  beforeEach(function() {
    jasmine.getEnv().requireFunctioningSets();
  });


  it('matches any actual set to an empty set', function() {
    var actualSet = new SetI(['foo', 'bar']);
    var containing = new jasmineUnderTest.SetContaining(new Set());

    expect(containing.asymmetricMatch(actualSet)).toBe(true);
  });

  it('matches when all the values in sample have matches in actual', function() {
    var actualSet = new SetI([
      {'foo': 'bar'}, 'baz', [1, 2, 3]
    ]);

    var containingSet = new SetI([
      [1, 2, 3], {'foo': 'bar'}
    ]);
    var containing = new jasmineUnderTest.SetContaining(containingSet);
    var matchersUtil = new jasmineUnderTest.MatchersUtil();

    expect(containing.asymmetricMatch(actualSet, matchersUtil)).toBe(true);
  });

  it('does not match when a value is not in actual', function() {
    var actualSet = new SetI([
      {'foo': 'bar'}, 'baz', [1, 2, 3]
    ]);

    var containingSet = new SetI([
      [1, 2], {'foo': 'bar'}
    ]);
    var containing = new jasmineUnderTest.SetContaining(containingSet);
    var matchersUtil = new jasmineUnderTest.MatchersUtil();

    expect(containing.asymmetricMatch(actualSet, matchersUtil)).toBe(false);
  });

  it('matches when all the values in sample have asymmetric matches in actual', function() {
    var actualSet = new SetI([
      [1, 2, 3, 4], 'other', 'foo1'
    ]);

    var containingSet = new SetI([
      jasmineUnderTest.stringMatching(/^foo\d/),
      jasmineUnderTest.arrayContaining([2, 3]),
    ]);
    var containing = new jasmineUnderTest.SetContaining(containingSet);
    var matchersUtil = new jasmineUnderTest.MatchersUtil();

    expect(containing.asymmetricMatch(actualSet, matchersUtil)).toBe(true);
  });

  it('does not match when a value in sample has no asymmetric matches in actual', function() {
    var actualSet = new SetI([
      'a-foo1', [1, 2, 3, 4], 'other'
    ]);

    var containingSet = new SetI([
      jasmine.stringMatching(/^foo\d/),
      jasmine.arrayContaining([2, 3]),
    ]);
    var containing = new jasmineUnderTest.SetContaining(containingSet);
    var matchersUtil = new jasmineUnderTest.MatchersUtil();

    expect(containing.asymmetricMatch(actualSet, matchersUtil)).toBe(false);
  });

  it('matches recursively', function() {
    var actualSet = new SetI([
      'foo', new SetI([1, 'bar', 2]), 'other'
    ]);

    var containingSet = new SetI([
      new jasmineUnderTest.SetContaining(new SetI(['bar'])), 'foo'
    ]);
    var containing = new jasmineUnderTest.SetContaining(containingSet);
    var matchersUtil = new jasmineUnderTest.MatchersUtil();

    expect(containing.asymmetricMatch(actualSet, matchersUtil)).toBe(true);
  });

  it('uses custom equality testers', function() {
    function tester(a, b) {
      // treat all negative numbers as equal
      return (typeof a == 'number' && typeof b == 'number') ? (a < 0 && b < 0) : a === b;
    }
    var actualSet = new SetI(['foo', -1]);
    var containing = new jasmineUnderTest.SetContaining(new SetI([-2, 'foo']));
    var matchersUtil = new jasmineUnderTest.MatchersUtil({customTesters: [tester]});

    expect(containing.asymmetricMatch(actualSet, matchersUtil)).toBe(true);
  });

  it('does not match when actual is not a set', function() {
    var containingSet = new SetI(['foo']);
    expect(new jasmineUnderTest.SetContaining(containingSet).asymmetricMatch('foo')).toBe(false);
    expect(new jasmineUnderTest.SetContaining(containingSet).asymmetricMatch(1)).toBe(false);
    expect(new jasmineUnderTest.SetContaining(containingSet).asymmetricMatch(['foo'])).toBe(false);
  });

  it('throws an error when sample is not a set', function() {
    expect(function() {
      new jasmineUnderTest.SetContaining({'foo': 'bar'}).asymmetricMatch(new Set());
    }).toThrowError(/You must provide a set/);
  });

  it('defines a `jasmineToString` method', function() {
    var sample = new Set(),
      containing = new jasmineUnderTest.SetContaining(sample),
      pp = jasmine.createSpy('pp').and.returnValue('sample');

    expect(containing.jasmineToString(pp)).toEqual(
      '<jasmine.setContaining(sample)>'
    );
    expect(pp).toHaveBeenCalledWith(sample);
  });
});
