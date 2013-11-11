var gql = require('../');
var es = require('event-stream');
var fs = require('fs');
var path = require('path');

var should = require('should');
require('mocha');

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
    var sample = {id: "test", g: "A"};

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
    var sample = {id: "test", g: "A"};
    var sample2 = {id: "testing", g: "B"};

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
    var sample = {id: "test", g: "A"};
    var sample2 = {id: "test", g: "B"};

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
    var sample = {id: "test", g: "GAT"};

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
    var sample = {id: "test", g: "AT"};
    var sample2 = {id: "testing", g: "BG"};

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
    var sample = {id: "test", g: "A"};
    var sample2 = {id: "test", g: "B"};

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
    var sample = {id: "test", g: "GAT"};

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
    var sample = {id: "test", g: "AT"};
    var sample2 = {id: "testing", g: "BG"};

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
    var sample = {id: "test", g: "GAT"};

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
    var sample = {id: "test", g: "AT"};
    var sample2 = {id: "testing", g: "BG"};

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
    var sample = {id: "test", g: "GAT"};

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
    var sample = {id: "test", g: "AT"};
    var sample2 = {id: "testing", g: null};

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
    var sample = {id: "test", g: null};

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
    var sample = {id: "test", g: null};
    var sample2 = {id: "testing", g: "AT"};

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
    var sample = {id: "test", g: "A"};

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
    var sample = {id: "test2", g: "C"};

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

describe('query() needs()', function() {
  it('should return a working query with correct progress', function(done) {
    var sample = {id: "test", g: "A"};

    var query = gql.query();
    query.needs(1);
    query.exact("test", "A");
    query.exact("test1", "B");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(1);
      query.percentage().should.equal(100);
      done();
    });
  });

  it('should return a working query with correct progress when it goes over', function(done) {
    var sample = {id: "test", g: "A"};
    var sample2 = {id: "test2", g: "B"};

    var query = gql.query();
    query.needs(1);
    query.exact("test", "A");
    query.exact("test2", "B");

    query.process(sample, function(err){
      should.not.exist(err);
      query.matches().length.should.equal(1);
      query.matches().should.eql([sample]);
      query.unmatched().length.should.equal(1);
      query.percentage().should.equal(100);
      query.process(sample2, function(err){
        should.not.exist(err);
        query.matches().length.should.equal(2);
        query.matches().should.eql([sample, sample2]);
        query.unmatched().length.should.equal(0);
        query.percentage().should.equal(200);
        done();
      });
    });
  });

});