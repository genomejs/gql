var EventEmitter = require('events').EventEmitter;
var util = require('util');
var es = require('event-stream');
var async = require('async');
var nop = require('nop');

function Query(opt){
  this._conditions = [];
  this._matches = [];
  this.options = opt || {};
}

util.inherits(Query, EventEmitter);

// query building

Query.prototype.exact = function(id, genotype){
  if (!id) throw new Error("Missing id in 'exact' query");
  if (!genotype) throw new Error("Missing genotype in 'exact' query");

  this.add(function(snp, cb){
    cb(null, (snp.id === id && snp.genotype === genotype));
  });
  return this;
};

Query.prototype.has = function(id, genotype){
  if (!id) throw new Error("Missing id in 'has' query");
  if (!genotype) throw new Error("Missing genotype in 'has' query");

  this.add(function(snp, cb){
    cb(null, (snp.id === id && snp.genotype.indexOf(genotype) !== -1));
  });
  return this;
};

Query.prototype.doesntExist = function(id){
  if (!id) throw new Error("Missing id in 'doesntExist' query");

  this.add(function(snp, cb){
    cb(null, (snp.id === id && !snp.genotype));
  });
  return this;
};

Query.prototype.exists = function(id){
  if (!id) throw new Error("Missing id in 'exists' query");

  this.add(function(snp, cb){
    cb(null, (snp.id === id && !!snp.genotype));
  });
  return this;
};

Query.prototype.exactNot = function(id, genotype){
  if (!id) throw new Error("Missing id in 'exactNot' query");
  if (!genotype) throw new Error("Missing genotype in 'exactNot' query");

  this.add(function(snp, cb){
    cb(null, (snp.id === id && snp.genotype !== genotype));
  });
  return this;
};

Query.prototype.hasNot = function(id, genotype){
  if (!id) throw new Error("Missing id in 'hasNot' query");
  if (!genotype) throw new Error("Missing genotype in 'hasNot' query");

  this.add(function(snp, cb){
    cb(null, (snp.id === id && (!snp.genotype || snp.genotype.indexOf(genotype) === -1)));
  });
  return this;
};

Query.prototype.exact = function(id, genotype){
  if (!id) throw new Error("Missing id in 'exact' query");
  if (!genotype) throw new Error("Missing genotype in 'exact' query");

  this.add(function(snp, cb){
    cb(null, (snp.id === id && snp.genotype === genotype));
  });
  return this;
};

// this is kind of a hack...
Query.prototype.or = function(){
  var args = [].slice.apply(arguments);
  var fns = args.map(function(q){
    return q._conditions.pop();
  });

  this.add(function(snp, cb){
    var matched = false;
    var isDone = function(){
      return matched === true || fns.length === 0;
    };
    var next = function(done){
      fns.shift()(snp, function(err, isMatch){
        if (err) return done(err);
        matched = isMatch;
        done();
      });
    };
    async.until(isDone, next, function(err){
      cb(err, matched);
    });
  });
  return this;
};

Query.prototype.add = function(fn) {
  this._conditions.push(fn);
  return this;
};

Query.prototype.stream = function(){
 return es.map(this.process.bind(this));
};

// task system

Query.prototype.percentage = function(){
  return (this.unmatched().length / this.matches().length) * 100;
};

Query.prototype.completed = function(){
  return this.unmatched().length === 0;
};

Query.prototype.matches = function(){
  return this._matches.filter(function(v, idx){
    return this.hasMatch(idx);
  }, this);
};

Query.prototype.unmatched = function(){
  return this._conditions.filter(function(v, idx){
    return !this.hasMatch(idx);
  }, this);
};

Query.prototype.process = function(snp, cb){
  if (!cb) cb = nop;
  if (this.completed()) return cb(null, snp);
  async.forEach(this.unmatched(), this._processCondition.bind(this, snp), function(err){
    cb(err, snp);
  });
  return this;
};

Query.prototype.hasMatch = function(idx) {
  return typeof this._matches[idx] !== "undefined";
};

Query.prototype._processCondition = function(snp, condition, cb) {
  condition(snp, function(err, isMatch){
    if (err) return cb(err);
    if (isMatch === true) this._handleMatch(snp, condition);
    cb();
  }.bind(this));
  return this;
};

Query.prototype._handleMatch = function(snp, condition) {
  this._matches[this._conditions.indexOf(condition)] = snp;
  return this;
};

module.exports = Query;