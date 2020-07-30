getJasmineRequireObj().toHaveBeenCalledWith = function(j$) {

  var getErrorMsg = j$.formatErrorMsg('<toHaveBeenCalledWith>', 'expect(<spyObj>).toHaveBeenCalledWith(...arguments)');

  /**
   * {@link expect} the actual (a {@link Spy}) to have been called with particular arguments at least once.
   * @function
   * @name matchers#toHaveBeenCalledWith
   * @since 1.3.0
   * @param {...Object} - The arguments to look for
   * @example
   * expect(mySpy).toHaveBeenCalledWith('foo', 'bar', 2);
   */
  function toHaveBeenCalledWith(matchersUtil) {
    return {
      compare: function() {
        var args = Array.prototype.slice.call(arguments, 0),
          actual = args[0],
          expectedArgs = args.slice(1),
          result = { pass: false };

        if (!j$.isSpy(actual)) {
          throw new Error(getErrorMsg('Expected a spy, but got ' + matchersUtil.pp(actual) + '.'));
        }

        if (!actual.calls.any()) {
          result.message = function() {
            return 'Expected spy ' + actual.and.identity + ' to have been called with:\n' +
              '  ' + matchersUtil.pp(expectedArgs) +
              '\nbut it was never called.';
          };
          return result;
        }

        if (matchersUtil.contains(actual.calls.allArgs(), expectedArgs)) {
          result.pass = true;
          result.message = function() {
            return 'Expected spy ' + actual.and.identity + ' not to have been called with:\n' +
              '  ' + matchersUtil.pp(expectedArgs) +
              '\nbut it was.';
          };
        } else {
          result.message = function() {
            var prettyPrintedCalls = actual.calls.allArgs().map(function(argsForCall) {
              return '  ' + matchersUtil.pp(argsForCall);
            });

            var diffs = actual.calls.allArgs().map(function(argsForCall, callIx) {
            var diffBuilder = new j$.DiffBuilder();
              matchersUtil.equals(argsForCall, expectedArgs, diffBuilder);
              return 'Call ' + callIx + ':\n' +
                diffBuilder.getMessage().replace(/^/mg, '  ');
            });

            return 'Expected spy ' + actual.and.identity + ' to have been called with:\n' +
              '  ' + matchersUtil.pp(expectedArgs) + '\n' + '' +
              'but actual calls were:\n' +
              prettyPrintedCalls.join(',\n') + '.\n\n' +
              diffs.join('\n');
          };
        }

        return result;
      }
    };
  }

  return toHaveBeenCalledWith;
};
