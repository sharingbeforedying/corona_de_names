function sequentially(funcs) {
  return funcs.reduce((accPromise, func) =>
    accPromise
    .then(acc_res => {
      //console.log("acc_res:", acc_res);
      return new Promise((resolve, reject) => {
        func(resolve, reject);
      })
      .then(child_res => {
        //console.log("child_res:", child_res);
        acc_res.push(child_res);
        return acc_res;
      });
    })
, Promise.resolve([]));
}

function partition(array, nb_elems)
{
    var output = [];

    for (var i = 0; i < array.length; i += nb_elems)
    {
        output[output.length] = array.slice(i, i + nb_elems);
    }

    return output;
}
