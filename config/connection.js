var winston = require('winston'),
	connection,
	pg = require('pg');

if(process.argv[2])
	var dbjson = require('./' + process.argv[2] + '.json');
else
	var dbjson = require('config');

module.exports.postgres_init_master = function(){

	var knex = require('knex')({
		client: 'pg',
		connection: dbjson.database.postgres.master,
		pool: {
			min: 0,
			max: 7
		}
	});

	var bookshelf = require('bookshelf')(knex);
	return bookshelf;
};

module.exports.postgres_init_slave = function(){

	var knex = require('knex')({
		client: 'pg',
		connection: dbjson.database.postgres.slave,
		pool: {
			min: 0,
			max: 7
		}
	});

	var bookshelf = require('bookshelf')(knex);
	return bookshelf;
};

module.exports.mongo_init_master = function(){

	var mongoose = require('mongoose');
	return mongoose.connect(dbjson.database.mongo.master);
};