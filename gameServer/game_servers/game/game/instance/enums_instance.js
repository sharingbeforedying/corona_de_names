const positionCellType = {
    UNKNOWN : -1,

    NEUTRAL: 0,
    RED:     1,
    BLUE:    2,
    BLACK:   3,
}
exports.positionCellType = positionCellType;

const gameCellEvalType = {
  UNCHECKED : 0,
  CHECKED   : 1,
}
exports.gameCellEvalType = gameCellEvalType;

const cnTeamType = {
    RED  : positionCellType.RED,
    BLUE : positionCellType.BLUE,
}
exports.cnTeamType = cnTeamType;

const cnPlayerRole = {
    TELLER  : 0,
    GUESSER : 1,
}
exports.cnPlayerRole = cnPlayerRole;

const contentCellType = {
    WORD:  0,
    IMAGE: 1,
}
exports.contentCellType = contentCellType;

const flipCellType = {
    VERSO : 0,
    RECTO : 1,
}
exports.flipCellType = flipCellType;

const gameTurnType = {
    NORMAL : 0,
    BONUS  : 1,
}
exports.gameTurnType = gameTurnType;

const actionType = {
    TELLER_HINT        : 0,
    GUESSER_SELECTION  : 1,
    GUESSER_END_TURN   : 2,
}
exports.actionType = actionType;
