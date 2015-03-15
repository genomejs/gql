var gql = require('../');
var should = require('should');
require('mocha');

describe('not()', function() {
  it('should invert a truthy function', function() {
    var fn = function(d) {
      should.exist(d);
      return true;
    };
    var inverseFn = gql.not(fn);
    inverseFn(123).should.equal(false);
  });
  it('should invert a falsey function', function() {
    var fn = function(d) {
      should.exist(d);
      return false;
    };
    var inverseFn = gql.not(fn);
    inverseFn(123).should.equal(true);
  });
});