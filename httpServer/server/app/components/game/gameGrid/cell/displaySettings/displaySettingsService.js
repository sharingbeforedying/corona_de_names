awApp.service('displaySettingsService',  function() {
      this.data = {
        cell_size: 200,
        font_size: 40,
      };

      this.configureWithNbCells = function(nb_cells) {
        if(nb_cells == 20) {
          this.data.cell_size = 270;
          this.data.font_size = 60;
        } else if(nb_cells == 25) {
          this.data.cell_size = 212;
          this.data.font_size = 50;
        } else {
          console.log("unsupported nb_cells");
        }
      };

      this.getSize_cell = function() {
        return this.data.cell_size;
      }

      this.setSize_cell = function(cellSize) {
        this.data.cell_size = cellSize;
      }

      this.getSize_font = function() {
        return this.data.font_size;
      }

      this.setSize_font = function(fontSize) {
        this.data.font_size = fontSize;
      }
});
