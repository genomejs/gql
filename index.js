var Query = require('./lib/Query');

module.exports = {
  query: function(opt){
    return new Query(opt);
  }
};