(function() {
  exports.Utils = {};

  function range(size, startAt = 0) {
      return [...Array(size).keys()].map(i => i + startAt);
  }
  exports.Utils.range = range;

  function logSchema(schema) {
    for(key in schema) {
      console.log(schema[key]);
    }
  }
  exports.Utils.logSchema = logSchema;

  function indexCombinations(size, nbCombElts) {
    var result = [];

    const array = range(size);

    const toSet = arr => new Set(arr);
    const toJsonSet = aset /* array or set */ => JSON.stringify([...new Set(aset)].sort());
    const fromJsonSet = jset => new Set(JSON.parse(jset));

    function loop(nbCombElts, array, acc) {
      for (var i = 0; i < array.length; i++) {
        var next = acc;
        var remaining = Array.from(array);
        const pickedElements = remaining.splice(i,1);
        next = next.concat(pickedElements);
        if (nbCombElts > 1) {
          loop(nbCombElts - 1, remaining , next);
        } else {
          result.push(next);
        }
      }
    }

    loop(nbCombElts, array, []);

    const indexesSuperset   = toSet(result.map(toJsonSet));
    // console.log("indexesSuperset", indexesSuperset);

    const indexesSuperArray = Array.from(indexesSuperset).map(jset => Array.from(fromJsonSet(jset)));
    // console.log("indexesSuperArray", indexesSuperArray);

    return indexesSuperArray;
  }

  function combinations(array, nbCombElts) {
    const indexesSuperArray = indexCombinations(array.length, nbCombElts);

    const comb = indexesSuperArray.map(indexes => indexes.map(index => array[index]));
    return comb;
  }
  exports.Utils.combinations = combinations;

  function configurations(array, size) {
    var result = [];

    function loop(size, array, acc) {
      for (var i = 0; i < array.length; i++) {
        var next = acc;
        var remaining = Array.from(array);
        const pickedElements = remaining.splice(i,1);
        next = next.concat(pickedElements);
        if (size > 1) {
          loop(size - 1, remaining , next);
        } else {
          result.push(next);
        }
      }
    }

    loop(size, array, []);

    return result;
  }
  exports.Utils.configurations = configurations;

})();
