const express = require('express')
var app = express();

const ImageSource = require('./ImageSource.js').ImageSource;
const imageSource = new ImageSource();

/*
app.get('/', (req, res) => {
  //res.send('Hello World!'))
  res.json({image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="})
});
*/

app.use('/js', express.static(__dirname + '/app/js'));
app.use('/lib', express.static(__dirname + '/app/lib'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/images_grid.html');
});

app.get('/api/affiche', function(req, res) {
  imageSource.p_get_json()
              .then(json => res.json(json))
});

app.get('/randomImages', function(req, res) {
  const nb_items = req.query.nb_items;
  imageSource.p_get_randomImageUrlData_array(nb_items)
             .then(json => res.json(json))
});

// app.get('/randomImage', function(req, res) {
//   imageSource.p_get_randomImageUrlData()
//              .then(json => res.json(json))
// });

const port = process.env.PORT || (2568);

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
