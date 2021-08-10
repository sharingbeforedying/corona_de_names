(function() {

exports.Mini = {};

function miniAssign(dst, src, fieldsFunc, miniSel) {

  const miniFields = mini(fieldsFunc(src), miniSel);

  Object.keys(miniFields).forEach((miniFieldName, i) => {
    const subMiniSel = miniSel[miniFieldName];
    if(subMiniSel) {
      miniAssign(dst[miniFieldName], src[miniFieldName], fieldsFunc, subMiniSel);
    } else {
      dst[miniFieldName] = src[miniFieldName];
    }
  });
}
exports.Mini.miniAssign = miniAssign;

function cloneFunc(fieldsFunc) {
  function clone(obj) {
    console.log("clone", obj);
    console.log("obj.constructor", obj.constructor);
    var cloned = new (obj.constructor);

    for (var field in fieldsFunc(obj)) {
        const value = obj[field];
        if(value != null) {
          const fields = fieldsFunc(value);
          if (fields != null) {
              // deep clone
              cloned[field] = clone(value);
          }
          else {
              // primitive values
              cloned[field] = value;
          }
        } else {
          cloned[field] = value;
        }
    }

    return cloned;
  }
  return clone;
}
// exports.Mini.cloneFunc = cloneFunc;


//shallow
function mini(obj, miniSel) {
  const miniObj = Object.keys(miniSel).reduce((acc, miniFieldName) => {
    var miniFieldValue = obj[miniFieldName];
    if(miniFieldValue) {
      const miniFieldMiniSel = miniSel[miniFieldName];
      if(miniFieldMiniSel) {
        miniFieldValue = mini(miniFieldValue, miniFieldMiniSel);
      }
      return Object.assign(acc, { [miniFieldName] : miniFieldValue });
    }
    return acc;
  }, {});
  return miniObj;
}
exports.Mini.mini = mini;

//deep
function miniClone(obj, fieldsFunc, miniSel) {
  var miniCloned;

  const cloned = (cloneFunc(fieldsFunc))(obj);

  if(!miniSel) {
    miniCloned = cloned;
  } else {
    miniCloned = mini(cloned, miniSel);
  }

  return miniCloned;
}
exports.Mini.miniClone = miniClone;


})();
