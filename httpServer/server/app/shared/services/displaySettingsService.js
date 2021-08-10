(function (){

  angular.module("awApp").service('displaySettingsService',  function() {

    const Rx = rxjs;
    const rx_displaySettings = new Rx.ReplaySubject(1);
    this.rx_displaySettings = rx_displaySettings.asObservable();

    this.data = {

      cell_size: {
        width: 200,
        height: 200,
      },

      word_color: {
        textColor: "#000000",
        bgColor:   "#FFFFFF",
      },
      word_size: {
        fontSize:  40,
      },

    };
    rx_displaySettings.next(this.data);

    this.configureWithNbCells = function(nb_cells) {
      if(nb_cells == 20) {
        this.data.cell_size = {
          width:  270,
          height: 270,
        };
        this.data.word_size.fontSize = 60;
      } else if(nb_cells == 25) {
        this.data.cell_size = {
          width:  212,
          height: 212,
        };
        this.data.word_size.fontSize = 50;
      } else {
        console.log("unsupported nb_cells");
      }

      rx_displaySettings.next(this.data);
    };

    // this.getCell_size = function() {
    //   return this.data.cell_size;
    // }

    this.setCell_size = function(cellSize) {
      console.log("displaySettingsService", "setCell_size", cellSize);
      this.data.cell_size = cellSize;
      rx_displaySettings.next(this.data);
    }



    // this.getWord_color = function() {
    //   return this.data.word_color;
    // }

    this.setWord_textColor = function(textColor) {
      this.data.word_color.textColor = textColor;
      rx_displaySettings.next(this.data);
    }

    this.setWord_bgColor = function(bgColor) {
      this.data.word_color.bgColor = bgColor;
      rx_displaySettings.next(this.data);
    }

    this.setWord_fontSize = function(fontSize) {
      this.data.word_size.fontSize = fontSize;
      rx_displaySettings.next(this.data);
    }

  });

})();
