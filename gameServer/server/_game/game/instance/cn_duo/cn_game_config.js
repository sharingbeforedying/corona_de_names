class GameConfig {

  static cells_range() {
    return [20,25];
  }

  static turns_range() {
    return [...Array(11).keys()].map(index => index + 1);
  }

  static errors_range() {
    return [...Array(9 + 1).keys()].map(index => index);
  }
}
