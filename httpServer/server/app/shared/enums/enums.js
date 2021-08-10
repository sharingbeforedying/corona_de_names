// const positionCellType = {
//     UNKNOWN : -1,
//
//     NEUTRAL: 0,
//     RED:     1,
//     BLUE:    2,
//     BLACK:   3,
// }
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
// exports.positionCellType = positionCellType;


const gameCellEvalType = {
  // UNCHECKED : 0,
  // CHECKED   : 1,

  UNCHECKED :     0,
  EXAMINED :      1,
  CHARACTERIZED : 2,
}
// exports.gameCellEvalType = gameCellEvalType;

// function reverseMap(obj) {
//   return Object.fromEntries(Object.entries(obj)
//                                    .filter(([key, value]) => value != null)
//                                    .map(([key, value]) => [value, key])
//                            );
// }
// const cnGameTypeToPosType = reverseMap(gameCellType);

const cnTeamType = {
    RED  : positionCellType.RED,
    BLUE : positionCellType.BLUE,
}
// exports.cnTeamType = cnTeamType;

const cnPlayerRole = {
    TELLER  : 0,
    GUESSER : 1,
}
// exports.cnPlayerRole = cnPlayerRole;

const contentCellType = {
    WORD:  0,
    IMAGE: 1,
}
// exports.contentCellType = contentCellType;

const flipCellType = {
    VERSO : 0,
    RECTO : 1,
}
// exports.flipCellType = flipCellType;

const gameTurnType = {
    NORMAL : 0,
    BONUS  : 1,
}
// exports.gameTurnType = gameTurnType;

const actionType = {
    TELLER_HINT        : 0,
    GUESSER_SELECTION  : 1,
    GUESSER_END_TURN   : 2,
}
// exports.actionType = actionType;
