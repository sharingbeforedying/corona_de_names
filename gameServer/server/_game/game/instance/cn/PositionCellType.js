const positionCellType = {
    UNINITIALIZED : -1,

    NEUTRAL: 0,
    RED:     1,
    BLUE:    2,
    BLACK:   3,
}
exports.positionCellType = positionCellType;

function isNeutral(posType) {
  var outBool = false;
  switch(posType) {
    case positionCellType.NEUTRAL:
    outBool = true;
  }
  return outBool;
}
exports.isNeutral = isNeutral;

function isRed(posType) {
  var outBool = false;
  switch(posType) {
    case positionCellType.RED:
    outBool = true;
  }
  return outBool;
}
exports.isRed = isRed;

function isBlue(posType) {
  var outBool = false;
  switch(posType) {
    case positionCellType.BLUE:
    outBool = true;
  }
  return outBool;
}
exports.isBlue = isBlue;

function isBlack(posType) {
  var outBool = false;
  switch(posType) {
    case positionCellType.BLACK:
    outBool = true;
  }
  return outBool;
}
exports.isBlack = isBlack;
