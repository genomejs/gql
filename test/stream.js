var gql = require('../');
var es = require('event-stream');
var fs = require('fs');
var path = require('path');

var should = require('should');
require('mocha');

describe('query() stream()', function() {

  it('should return a stream', function(done) {
    var query = gql.query();
    var stream = query.stream();
    should.exist(stream);
    done();
  });

});

describe('query() stream()', function() {
  it('should return a working query', function(done) {
    var faked = [];
    faked.push({id:"rs2032651", genotype:"D"});

    var query = gql.query();
    query.exact("rs2032651", "D");
    query.has("rs2032651", "A");
    query.has("rs9341296", "C");
    query.has("rs9341296", "T");
    query.has("rs13304168", "C");
    query.has("rs13304168", "T");
    query.has("rs1118473", "A");
    query.has("rs1118473", "G");
    query.has("rs150173", "A");
    query.has("rs150173", "C");
    query.has("rs16980426", "G");
    query.has("rs16980426", "T");

    es.readArray(faked).pipe(query.stream()).on('end', function(){
      query.matches().length.should.equal(1);
      query.matches().should.eql(faked);
      query.unmatched().length.should.equal(11);
      done();
    });
  });
});