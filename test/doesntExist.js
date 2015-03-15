var gql = require('../');
var should = require('should');
require('mocha');

describe('doesntExist()', function() {
  it('should not match with two alleles', function() {
    var data = {
      rs1234: {
        genotype: 'AA'
      }
    };
    var fn = gql.doesntExist('rs1234');
    fn(data).should.equal(false);
  });
  it('should not match with one allele', function() {
    var data = {
      rs1234: {
        genotype: 'A'
      }
    };
    var fn = gql.doesntExist('rs1234');
    fn(data).should.equal(false);
  });
  it('should match with no data', function() {
    var data = {};
    var fn = gql.doesntExist('rs1234');
    fn(data).should.equal(true);
  });
  it('should match with no genotype', function() {
    var data = {
      rs1234: {
        genotype: null
      }
    };
    var fn = gql.doesntExist('rs1234');
    fn(data).should.equal(true);
  });
});