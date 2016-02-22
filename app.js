/**********global variables**************/
ROOT_DIR = __dirname + '/';
IMAGE_FOLDER = 'public/media/';
ENVIRONMENT = 'local';
/****************************************/

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    http = require('http'),
    jroutes = require('json-routing'),
    underscore = require('underscore'),
    vhost = require('vhost'),
    multer = require('multer');

    //RedisStore = require('connect-redis');

var config = require('./config/env')(),
    domain = require('./config/domain_route')();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*app.use(multer({
    dest : "./uploads/",
    onFileSizeLimit : function (file) {
      console.log('Failed: ', file.originalname)
      fs.unlink('./' + file.path) // delete the partially written file
    },
    limits : {
      files : 1,
      fileSize : 1000000
    },
    onError : function (error, next) {
      //console.log(error)
      next(error)
    },
    onFileSizeLimit : function (file) {
      console.log('Failed: ', file.originalname);
      fs.unlink('./' + file.path); // delete the partially written file
    },
    onFilesLimit : function () {
      console.log('Crossed file limit!')
    },
}));*/
app.use(express.static(path.join(__dirname, 'public')));

/*********domain based routing************/
for(var key in domain.domains)
{
    app.use(vhost(domain.domains[key].domain_name, domain.domains[key].object));
}
/*****************************************/

//var uri = 'mongodb://localhost:27017/nodetest2';
//global.mongooseObj = mongoose.createConnection(uri);
mongooseObj = require(ROOT_DIR + 'config/connection').mongo_init_master();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})

// error handlers

// development error handler
// will print stacktrace
if (config.mode == 'local' || config.mode == 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.createServer(app).listen(config.port, function(){
  console.log('Express server listening on port ' + config.port + ' environment : ' + config.mode);
});

module.exports = app;
