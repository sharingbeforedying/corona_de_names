const FileUtils = require('../../../../../utils/fileUtils.js').FileUtils;

const path = require("path");

const ContentCell = require('../ContentCell.js').ContentCell;
const ContentItem = require('../ContentItem.js').ContentItem;

class Debug {

  static getBase64Image(index) {
    const basename = "" + index + ".jpg";
    // const dir = path.resolve('./images');
    const dir = path.join(__dirname, 'images/jpg');
    const filepath = path.join(dir, basename);
    console.log("filepath", filepath);

    return FileUtils.base64_encode(filepath);
  }

  static getBase64Image_white() {
    const basename = "1px_white.png";
    // const dir = path.resolve('./images');
    const dir = path.join(__dirname, 'images/png');
    const filepath = path.join(dir, basename);
    console.log("filepath", filepath);

    return FileUtils.base64_encode(filepath);
  }

  static contentCell(cellIndex) {
    const cell = new ContentCell();

    // const word = "word" + cellIndex;
    const word = "";

    const item_word  = ContentItem.word(word);
    cell.items[item_word.type] = item_word;

    // const base64Image = Debug.getBase64Image(cellIndex);
    const base64Image = Debug.getBase64Image_white();

    const imageSrc    = "data:image/png;base64," + base64Image;
    const item_image  = ContentItem.image(imageSrc);
    cell.items[item_image.type] = item_image;

    return cell;
  }

}

exports.Debug = Debug;
