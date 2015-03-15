var gql = require('../');
var should = require('should');
require('mocha');

describe('exists()', function() {
  it('should match with two alleles', function() {
    var data = {
      rs1234: {
        genotype: 'AA'
      }
    };
    var fn = gql.exists('rs1234');
    fn(data).should.equal(true);
  });
  it('should match with one allele', function() {
    var data = {
      rs1234: {
        genotype: 'A'
      }
    };
    var fn = gql.exists('rs1234');
    fn(data).should.equal(true);
  });
  it('should not match with no data', function() {
    var data = {};
    var fn = gql.exists('rs1234');
    fn(data).should.equal(false);
  });
  it('should not match with no genotype', function() {
    var data = {
      rs1234: {
        genotype: null
      }
    };
    var fn = gql.exists('rs1234');
    fn(data).should.equal(false);
  });
});