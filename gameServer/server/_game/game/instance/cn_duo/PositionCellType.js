const positionCellType = {
    UNINITIALIZED : -1,

    //"classic"
    NEUTRAL: 0,
    RED:     1,
    BLUE:    2,
    BLACK:   3,


    //"duo specific"
    RED_RED__BLUE_BLUE:       12,


    RED_RED__BLUE_NEUTRAL:    21,

    RED_BLACK__BLUE_BLUE:     25,
    RED_BLACK__BLUE_NEUTRAL:  26,


    BLUE_BLUE__RED_NEUTRAL:   31,

    BLUE_BLACK__RED_RED:      35,
    BLUE_BLACK__RED_NEUTRAL:  36,
}
exports.positionCellType = positionCellType;

function isNeutral(posType) {
  var outBool;
  switch(posType) {
    case positionCellType.NEUTRAL:
    case positionCellType.RED_RED__BLUE_NEUTRAL:
    case positionCellType.BLUE_BLUE__RED_NEUTRAL:
      outBool = true;
      break;
    default:
      outBool = false;
      break;
  }
  //debug
  if(outBool) {
    console.log("isNeutral", posType);
  }
  return outBool;
}
exports.isNeutral = isNeutral;

function isRed(posType) {
  var outBool;
  switch(posType) {
    case positionCellType.RED:
    case positionCellType.RED_RED__BLUE_BLUE:
      outBool = true;
      break;
    default:
      outBool = false;
      break;
  }
  //debug
  if(outBool) {
    console.log("isRed", posType);
  }
  return outBool;
}
exports.isRed = isRed;

function isBlue(posType) {
  var outBool;
  switch(posType) {
    case positionCellType.BLUE:
    case positionCellType.RED_RED__BLUE_BLUE:
      outBool = true;
      break;
    default:
      outBool = false;
      break;
  }
  //debug
  if(outBool) {
    console.log("isBlue", posType);
  }
  return outBool;
}
exports.isBlue = isBlue;

function isBlack(posType) {
  var outBool;
  switch(posType) {
    case positionCellType.BLACK:
    case positionCellType.RED_BLACK__BLUE_BLUE:
    case positionCellType.RED_BLACK__BLUE_NEUTRAL:
    case positionCellType.BLUE_BLACK__RED_RED:
    case positionCellType.BLUE_BLACK__RED_NEUTRAL:
      outBool = true;
      break;
    default:
      outBool = false;
      break;
  }
  //debug
  if(outBool) {
    console.log("isBlack", posType);
  }
  return outBool;
}
exports.isBlack = isBlack;
