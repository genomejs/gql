module.exports = function(a, b){
  if (a.length !== b.length) return false; // short exit if possible
  if (a === b) return true; // exact match
  if (a[0] === b[1] && a[1] === b[0]) return true; // reverse match
  return false;
};