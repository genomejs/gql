var roughMatch = require('./lib/genotypeMatch');

function callFn(data) {
  return function(fn) {
    return fn(data);
  };
}

module.exports = logic = {
  // higher-level, operates on nested conditions
  and: function(conditions){
    if (!Array.isArray(conditions) || conditions.length === 0) {
      throw new Error('and must receive an array with conditions');
    }
    return function(data){
      return conditions.every(callFn(data));
    };
  },
  atLeast: function(num, conditions){
    if (typeof num !== 'number') {
      throw new Error('atLeast must receive the number of conditions to be met');
    }
    if (!Array.isArray(conditions) || conditions.length === 0) {
      throw new Error('atLeast must receive an array with conditions');
    }
    return function(data){
      var matches = conditions.filter(callFn(data));
      return (matches.length >= num);
    };
  },
  only: function(k, v){
    if (typeof v !== 'string') {
      throw new Error('only can only check for strings');
    }
    if (v.length !== 1) {
      throw new Error('only accepts only one allele')
    }
    return function(data){
      var snp = data[k];
      if (!(snp && snp.genotype)) {
        return false;
      }
      return snp.genotype.split('').every(function(allele) {
        return allele === v;
      });
    };
  },
  or: function(conditions){
    if (!Array.isArray(conditions) || conditions.length === 0) {
      throw new Error('or must receive an array with conditions');
    }
    return function(data){
      return conditions.some(callFn(data));
    };
  },
  not: function(condition){
    if (typeof condition !== 'function') {
      throw new Error('not must receive a function');
    }
    return function(data){
      return !condition(data);
    };
  },

  // lower-level
  exists: function(k){
    if (typeof k !== 'string') {
      throw new Error('exists must receive a key name');
    }
    return function(data){
      return data[k] != null && data[k].genotype != null;
    };
  },
  has: function(k, v){
    if (typeof v !== 'string') {
      throw new Error('has can only check for strings');
    }
    if (v.length !== 1) {
      throw new Error('has only accepts one allele, use exact instead')
    }
    return function(data){
      var snp = data[k];
      return !!(snp && snp.genotype && snp.genotype.indexOf(v) !== -1);
    };
  },
  exact: function(k, v){
    if (typeof v !== 'string') {
      throw new Error('exact can only check for strings');
    }
    return function(data){
      var snp = data[k];
      return !!(snp && snp.genotype && roughMatch(snp.genotype, v));
    };
  },

  // sugar
  none: function(conditions){
    if (!Array.isArray(conditions) || conditions.length === 0) {
      throw new Error('none must receive an array with conditions');
    }
    return logic.not(logic.or(conditions));
  },
  doesntExist: function(k){
    if (typeof k !== 'string') {
      throw new Error('doesntExist must receive a key name');
    }
    return logic.not(logic.exists(k));
  }
};
