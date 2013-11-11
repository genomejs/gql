var gql = require('../');
var es = require('event-stream');
var fs = require('fs');
var path = require('path');

var should = require('should');
require('mocha');

var isMale = require('./fixtures/is-male.json');

describe('query()', function() {

  it('should return a query builder', function(done) {
    var query = gql.query();
    should.exist(query);
    should.exist(query.process);
    done();
  });

});

describe('query() exact()', function() {
  it('should return a working query', function(done) {
    var sample = {id: "test", genotype: "A"};

    var query = gql.query();
    query.exact("test", "A");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      done();
    });
  });

  it('should return a working query with multiple statements', function(done) {
    var sample = {id: "test", genotype: "A"};
    var sample2 = {id: "testing", genotype: "B"};

    var query = gql.query();
    query.exact("test", "A");
    query.exact("testing", "B");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(1);
      query.process(sample2, function(err){
        should.not.exist(err);
        query.matches().length.should.equal(2);
        query.matches().should.eql([sample, sample2]);
        query.unmatched().length.should.equal(0);
        done();
      });
    });
  });

  it('should return a working query that does not overwrite finished conditions', function(done) {
    var sample = {id: "test", genotype: "A"};
    var sample2 = {id: "test", genotype: "B"};

    var query = gql.query();
    query.exact("test", "A");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      query.process(sample2, function(err){
        should.not.exist(err);
        query.matches().length.should.equal(1);
        query.matches().should.eql([sample]);
        query.unmatched().length.should.equal(0);
        done();
      });
    });
  });

});

describe('query() has()', function() {
  it('should return a working query', function(done) {
    var sample = {id: "test", genotype: "GAT"};

    var query = gql.query();
    query.has("test", "A");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      done();
    });
  });

  it('should return a working query with multiple statements', function(done) {
    var sample = {id: "test", genotype: "AT"};
    var sample2 = {id: "testing", genotype: "BG"};

    var query = gql.query();
    query.has("test", "A");
    query.has("testing", "B");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(1);
      query.process(sample2, function(err){
        should.not.exist(err);
        query.matches().length.should.equal(2);
        query.matches().should.eql([sample, sample2]);
        query.unmatched().length.should.equal(0);
        done();
      });
    });
  });

  it('should return a working query that does not overwrite finished conditions', function(done) {
    var sample = {id: "test", genotype: "A"};
    var sample2 = {id: "test", genotype: "B"};

    var query = gql.query();
    query.has("test", "A");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      query.process(sample2, function(err){
        should.not.exist(err);
        query.matches().length.should.equal(1);
        query.matches().should.eql([sample]);
        query.unmatched().length.should.equal(0);
        done();
      });
    });
  });

});

describe('query() hasNot()', function() {
  it('should return a working query', function(done) {
    var sample = {id: "test", genotype: "GAT"};

    var query = gql.query();
    query.hasNot("test", "B");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      done();
    });
  });

  it('should return a working query with multiple statements', function(done) {
    var sample = {id: "test", genotype: "AT"};
    var sample2 = {id: "testing", genotype: "BG"};

    var query = gql.query();
    query.hasNot("test", "B");
    query.hasNot("testing", "B");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(1);
      query.process(sample2, function(err){
        should.not.exist(err);
        query.matches().length.should.equal(1);
        query.matches().should.eql([sample]);
        query.unmatched().length.should.equal(1);
        done();
      });
    });
  });

});

describe('query() exactNot()', function() {
  it('should return a working query', function(done) {
    var sample = {id: "test", genotype: "GAT"};

    var query = gql.query();
    query.exactNot("test", "B");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      done();
    });
  });

  it('should return a working query with multiple statements', function(done) {
    var sample = {id: "test", genotype: "AT"};
    var sample2 = {id: "testing", genotype: "BG"};

    var query = gql.query();
    query.exactNot("test", "B");
    query.exactNot("testing", "BG");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(1);
      query.process(sample2, function(err){
        should.not.exist(err);
        query.matches().length.should.equal(1);
        query.matches().should.eql([sample]);
        query.unmatched().length.should.equal(1);
        done();
      });
    });
  });

});

describe('query() exists()', function() {
  it('should return a working query', function(done) {
    var sample = {id: "test", genotype: "GAT"};

    var query = gql.query();
    query.exists("test");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      done();
    });
  });

  it('should return a working query with multiple statements', function(done) {
    var sample = {id: "test", genotype: "AT"};
    var sample2 = {id: "testing", genotype: null};

    var query = gql.query();
    query.exists("test");
    query.exists("testing");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(1);
      query.process(sample2, function(err){
        should.not.exist(err);
        query.matches().length.should.equal(1);
        query.matches().should.eql([sample]);
        query.unmatched().length.should.equal(1);
        done();
      });
    });
  });

});

describe('query() doesntExist()', function() {
  it('should return a working query', function(done) {
    var sample = {id: "test", genotype: null};

    var query = gql.query();
    query.doesntExist("test");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      done();
    });
  });

  it('should return a working query with multiple statements', function(done) {
    var sample = {id: "test", genotype: null};
    var sample2 = {id: "testing", genotype: "AT"};

    var query = gql.query();
    query.doesntExist("test");
    query.doesntExist("testing");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(1);
      query.process(sample2, function(err){
        should.not.exist(err);
        query.matches().length.should.equal(1);
        query.matches().should.eql([sample]);
        query.unmatched().length.should.equal(1);
        done();
      });
    });
  });

});

describe('query() or()', function() {
  it('should return a working query that matches idx 0', function(done) {
    var sample = {id: "test", genotype: "A"};

    var query = gql.query();
    query.or(query.exact("test", "A"), query.exact("test","B"), query.exact("test2","C"));

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      done();
    });
  });

  it('should return a working query that matches idx 2', function(done) {
    var sample = {id: "test2", genotype: "C"};

    var query = gql.query();
    query.or(query.exact("test", "A"), query.exact("test","B"), query.exact("test2","C"));

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(0);
      done();
    });
  });

});