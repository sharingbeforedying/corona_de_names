function ut_disabled(el, disabled) {
  try {
    el.disabled = disabled;
  }
  catch(E){
    console.log("ut_disabled: something went wrong");
  }
  if (el.childNodes && el.childNodes.length > 0) {
    for (var x = 0; x < el.childNodes.length; x++) {
      ut_disabled(el.childNodes[x], disabled);
    }
  }
}

function ut_hidden(el, hidden) {
  try {
    el.hidden = hidden;
  }
  catch(E){
    console.log("ut_hidden: something went wrong");
  }
  if (el.childNodes && el.childNodes.length > 0) {
    for (var x = 0; x < el.childNodes.length; x++) {
      ut_hidden(el.childNodes[x], hidden);
    }
  }
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

/*
Object.prototype.mapKeys = function(mapper) {
  return Object.keys(this).map(mapper);
};

Object.prototype.mapValues = function(mapper) {
  return Object.values(this).map(mapper);
};
*/

function mapKeys(obj, fn) {
  return Object.keys(obj).reduce((acc, k) => {
    acc[fn(obj[k], k, obj)] = obj[k];
    return acc;
  }, {});
}

function mapVals(obj, fn) {
  return Object.values(obj).reduce((acc, k) => {
    acc[fn(obj[k], k, obj)] = obj[k];
    return acc;
  }, {});
}



function rgbToHex_cssString(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('');
}

function hexToRgb_array(hex) {
  //returns [r,g,b]
  return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16));
}

function hexToRgba_cssString(hex, alpha) {
  const rgb = hexToRgb_array(hex);
  const r   = rgb[0];
  const g   = rgb[1];
  const b   = rgb[2];
  // const a   = Math.floor(alpha * 255);
  const a   = alpha;
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
