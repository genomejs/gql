var genotypeMatch = require('../lib/genotypeMatch');
var should = require('should');
require('mocha');

describe('lib/genotypeMatch()', function() {
  it('should match straight forward with two alleles', function(done) {
    var a = 'AB';
    var b = 'AB';

    genotypeMatch(a,b).should.equal(true);
    done();
  });

  it('should match straight forward with one allele', function(done) {
    var a = 'A';
    var b = 'A';

    genotypeMatch(a,b).should.equal(true);
    done();
  });

  it('should not match straight forward with one allele', function(done) {
    var a = 'B';
    var b = 'A';

    genotypeMatch(a,b).should.equal(false);
    done();
  });

  it('should match reverse with two alleles', function(done) {
    var a = 'AB';
    var b = 'BA';

    genotypeMatch(a,b).should.equal(true);
    done();
  });

  it('should not match straight forward with two alleles', function(done) {
    var a = 'AB';
    var b = 'GT';

    genotypeMatch(a,b).should.equal(false);
    done();
  });
});