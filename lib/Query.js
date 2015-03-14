var EventEmitter = require('events').EventEmitter;
var util = require('util');
var es = require('event-stream');
var async = require('async');
var nop = require('nop');
var roughMatch = require('./genotypeMatch');

function Query(opt){
  this._conditions = [];
  this._matches = [];
  this.options = opt || {};
}

util.inherits(Query, EventEmitter);

// query building

// all allele match
Query.prototype.exact = function(id, genotype){
  if (!id) throw new Error("Missing id in 'exact' query");
  if (!genotype) throw new Error("Missing genotype in 'exact' query");

  this.add({'exact': [id, genotype]});
  return this;
};

Query.prototype.exactNot = function(id, genotype){
  if (!id) throw new Error("Missing id in 'exactNot' query");
  if (!genotype) throw new Error("Missing genotype in 'exactNot' query");

  this.add({'exactNot': [id, genotype]});
  return this;
};

// one allele match
Query.prototype.has = function(id, genotype){
  if (!id) throw new Error("Missing id in 'has' query");
  if (!genotype) throw new Error("Missing genotype in 'has' query");

  this.add({'has': [id, genotype]});
  return this;
};

Query.prototype.hasNot = function(id, genotype){
  if (!id) throw new Error("Missing id in 'hasNot' query");
  if (!genotype) throw new Error("Missing genotype in 'hasNot' query");

  this.add({'hasNot': [id, genotype]});
  return this;
};

// any allele match
Query.prototype.exists = function(id){
  if (!id) throw new Error("Missing id in 'exists' query");

  this.add({'exists': id});
  return this;
};

Query.prototype.doesntExist = function(id){
  if (!id) throw new Error("Missing id in 'doesntExist' query");

  this.add({'doesntExist': id});
  return this;
};

// grouping queries
Query.prototype.or = function(){
  var args = [].slice.apply(arguments);
  var conds = args.map(function(q){
    return q._conditions.pop();
  });
  
  this.add({'or': conds});
  return this;
};

Query.prototype.and = function(){
  var args = [].slice.apply(arguments);
  var conds = args.map(function(q){
    return q._conditions.pop();
  });
  
  this.add({'and': conds});
  return this;
};

// base functions
Query.prototype.add = function(obj) {
  if(typeof obj === 'function') {
    obj = {'function': obj  }
  }
  this._conditions.push(obj);
  return this;
};

Query.prototype.stream = function(){
 return es.map(this.process.bind(this));
};

// task system
Query.prototype.needs = function(num){
  this._needs = num;
  return this;
};

Query.prototype.percentage = function(){
  if (this.matches().length === 0) return 0;
  var needs = this._needs || this.unmatched().length;
  return (this.matches().length / needs) * 100;
};

Query.prototype.completed = function(){
  return this.unmatched().length === 0;
};

Query.prototype.matches = function(){
  return this._matches.filter(function(v, idx){
    return this.hasMatch(idx);
  }, this);
};

Query.prototype.unmatched = function(opts){
  opts = opts || {}
  var um =  this._conditions
      .filter(function(v, idx){
        return !this.hasMatch(idx);
      }, this);

  if(opts.type !== 'object') {
    um = um.map(this._getFunction.bind(this));
  }
  return um;
};

Query.prototype.process = function(snp, cb){
  if (!cb) cb = nop;
  if (this.completed()) return cb(null, snp);
  async.forEach(this.unmatched({type: 'object'}), this._processCondition.bind(this, snp), function(err){
    cb(err, snp);
  });
  return this;
};

Query.prototype.hasMatch = function(idx) {
  return typeof this._matches[idx] !== "undefined";
};

Query.prototype.export = function () {
  var json = {}
  json.conditions = this._conditions
  if(this._needs) json.needs = this._needs
  return json
}

Query.prototype._processCondition = function(snp, condition, cb) {
  this._getFunction(condition)(snp, function(err, isMatch){
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


Query.prototype._getFunction = function (obj) {
  var parse = this._getFunction.bind(this)
  
  function exact(arr, snp, cb){
    cb(null, (snp.id === arr[0] && roughMatch(snp.g, arr[1])));
  }

  function exactNot(arr, snp, cb){
    cb(null, (snp.id === arr[0] && !roughMatch(snp.g, arr[1])));
  }
  
  function has(arr, snp, cb){
    cb(null, (snp.id === arr[0] && snp.g && snp.g.indexOf(arr[1]) !== -1));
  }
  
  function hasNot(arr, snp, cb){
    cb(null, (snp.id === arr[0] && (!snp.g || snp.g.indexOf(arr[1]) === -1)));
  }
  
  function exists(id, snp, cb){
    cb(null, (snp.id === id && !!snp.g));
  }

  function doesntExist(id, snp, cb){
    cb(null, (snp.id === id && !snp.g));
  }
  
  function or(conds, snp, cb){
    var matched = false;
    var isDone = function(){
      return matched === true || conds.length === 0;
    };
    var next = function(done){
      var fn = parse(conds.shift())
      fn(snp, function(err, isMatch){
        if (err) return done(err);
        matched = isMatch;
        done();
      });
    };
    async.until(isDone, next, function(err){
      cb(err, matched);
    });
  }
  
  function and(conds, snp, cb){
    var matched = true;
    var isDone = function(){
      return matched === false || conds.length === 0;
    };
    var next = function(done){
      var fn = parse(conds.shift())
      fn(snp, function(err, isMatch){
        if (err) return done(err);
        matched = isMatch;
        done();
      });
    };
    async.until(isDone, next, function(err){
      cb(err, matched);
    });
  }

  if(obj.exact) return exact.bind(null, obj.exact)
  if(obj.exactNot) return exactNot.bind(null, obj.exactNot)
  if(obj.has) return has.bind(null, obj.has)
  if(obj.hasNot) return hasNot.bind(null, obj.hasNot)
  if(obj.exists) return exists.bind(null, obj.exists)
  if(obj.doesntExist) return doesntExist.bind(null, obj.doesntExist)
  if(obj.not) return not.bind(null, obj.not)
  if(obj.or) return or.bind(null, obj.or)
  if(obj.and) return and.bind(null, obj.and)
  if(obj.function) return obj.function
  return obj // assume fn
}

module.exports = Query;