var gql = require('../');
var should = require('should');
require('mocha');

describe('has()', function() {
  it('should throw error with two alleles', function() {
    var data = {
      rs1234: {
        genotype: 'AA'
      }
    };
    try {
      var fn = gql.has('rs1234', 'AA');
    } catch(err) {
      should.exist(err);
    }
  });
  it('should match with one alleles', function() {
    var data = {
      rs1234: {
        genotype: 'A'
      }
    };
    var fn = gql.has('rs1234', 'A');
    fn(data).should.equal(true);
  });
  it('should match with one allele when two given', function() {
    var data = {
      rs1234: {
        genotype: 'AT'
      }
    };
    var fn = gql.has('rs1234', 'T');
    fn(data).should.equal(true);
  });
  it('should not match with wrong allele', function() {
    var data = {
      rs1234: {
        genotype: 'A'
      }
    };
    var fn = gql.has('rs1234', 'T');
    fn(data).should.equal(false);
  });
});