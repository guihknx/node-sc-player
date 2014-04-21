
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/');
var user = require('./routes/user');
var fetch = require('./routes/fetch.js');
var http = require('http');
var jQuery = require("jquery");
var path = require('path');
var    appDir = path.dirname(require.main.filename);
var app = express();
app.set('base', '/');

// all environments
app.set('port', 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());

app.use(express.methodOverride());
//app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
//app.use("/public", express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, 'public/')));
app.use(app.router);



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//p.get(/^\/public\/(.*)/, function (req, res) {
  //console.log('assets/app/static/' + req.params[0]);
 // res.sendfile('assets/app/static/' + req.params[0]);
////
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/fetch', fetch.fetch);
app.get(/\/track\/([^\/]+)\/?/, routes.index );
//app.get('*', routes.index );
app.use(/\/track\/([^\/]+)\/?/, express.static(__dirname + '../public'));

http.createServer(app).listen(app.get('port'), function(){
        console.log(this);
  console.log('Express server listening on port ' + app.get('port') );
});
