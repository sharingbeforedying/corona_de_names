const express = require('express');

const port = process.env.PORT || 8080;
const app = express()
//app.use(express.json());


// const cors = require('cors');
// app.use(cors());   //cors for all, (=="open bar")

//cors for image dnd
// const corsOptions__image_dnd = {
//   origin: 'https://www.google.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
//
// const fileInputSourceHtmlPath = '/app/shared/components/fileInputSource/fileInputSource.html';
// app.get(fileInputSourceHtmlPath, cors(corsOptions__image_dnd), function(req, res) {
//   console.log("get /" + fileInputSourceHtmlPath);
//   res.sendFile(__dirname + fileInputSourceHtmlPath);
// });


app.get('/app/shared/services/servers/GameServerInfo.js', function(req, res) {
  // res.sendFile(__dirname + '/app/index.html');

  console.log("get / GameServerInfo.js");
  console.log("req", req.headers.host);
  //examples: "localhost:8080", "192.168.1.11:8080", "15.16.17.18:8080"

  const reqDest = req.headers.host.split(":")[0];
  // console.log("reqDest", reqDest);

  const isLocalhost = ( reqDest == "localhost" || reqDest == "127.0.0.1");
  if(isLocalhost) {
    res.sendFile(__dirname + '/GameServerInfo_localhost.js');
  } else {
    if(reqDest == "192.168.1.11") {
      res.sendFile(__dirname + '/GameServerInfo_network_local.js');
    } else {
      res.sendFile(__dirname + '/GameServerInfo_network_global.js');
    }
  }

});

app.use('/js',       express.static(__dirname + '/app/assets/js'));
app.use('/lib',      express.static(__dirname + '/app/assets/lib'));
app.use('/css',      express.static(__dirname + '/app/assets/css'));
app.use('/img',      express.static(__dirname + '/app/assets/img'));

app.use('/app',   express.static(__dirname + '/app'));

app.use('/bin',      express.static(__dirname + '/bin'));
app.use('/dist',     express.static(__dirname + '/dist'));


app.get('/', function(req, res) {
  // console.log("req", req);
  console.log("req", req.headers.host);
  res.sendFile(__dirname + '/app/index.html');
});

app.listen(port, '0.0.0.0', (err) => {
// app.listen(port, '127.0.0.1', (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
