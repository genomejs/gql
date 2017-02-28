var gql = require('../');
var should = require('should');
require('mocha');

describe('exact()', function() {
  it('should match with two alleles', function() {
    var data = {
      rs1234: {
        genotype: 'AA'
      }
    };
    var fn = gql.exact('rs1234', 'AA');
    fn(data).should.equal(true);
  });
  it('should match with one alleles', function() {
    var data = {
      rs1234: {
        genotype: 'A'
      }
    };
    var fn = gql.exact('rs1234', 'A');
    fn(data).should.equal(true);
  });
  it('should not match with one allele when two given', function() {
    var data = {
      rs1234: {
        genotype: 'AA'
      }
    };
    var fn = gql.exact('rs1234', 'A');
    fn(data).should.equal(false);
  });
  it('should not match with two alleles when one given', function() {
    var data = {
      rs1234: {
        genotype: 'A'
      }
    };
    var fn = gql.exact('rs1234', 'AA');
    fn(data).should.equal(false);
  });
});
