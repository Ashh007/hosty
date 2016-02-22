var winston = require('winston'),
	connection;

if(process.argv[2])
	var dbjson = require('./' + process.argv[2] + '.json');
else
	var dbjson = require('config');

module.exports.mongo_init_master = function(){

	var mongoose = require('mongoose');
	return mongoose.connect(dbjson.database.mongo.master);
};