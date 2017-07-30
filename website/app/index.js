var express = require('express');
var path = require('path');
var app = express();

app.use('/fonts', express.static('fonts'));
app.use('/images', express.static('images'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

var server = app.listen(3000, () => {
    var host = server.address().address;
    host = (host === '::' ? 'localhost' : host);
    var port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
});