var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	routes = require('json-routing'),
	apiv = require('api-version'),
	apiDom = express();
var config = require('config');
var modules = require(ROOT_DIR + 'config/modules.json');

module.exports = function()
{
	/******************api-versioning*********************/
	var apiDomV1 = apiv.version(apiDom, '/v1'),
		apiDomV2 = apiv.version(apiDom, '/v2');

	for (var i = 0; i < modules.length; i++) {

		var routeOptionsV1 = {
			routesPath	: './app/' + modules[i] + "/routes/v1/",
			controllersPath: './app/' + modules[i] + "/controllers/",
			policyPath: './app/' + modules[i] + '/policy',
			cors: false
		};
		routes(apiDomV1, routeOptionsV1);

		var routeOptionsV2 = {
			routesPath: './app/' + modules[i] + "/routes/v2/",
			controllersPath: './app/' + modules[i] + "/controllers/",
			policyPath: './app/' + modules[i] + '/policy',
			cors: false
		};
		routes(apiDomV2, routeOptionsV2);
	}
	/*****************************************************/

	var domains = {

		'domains' : [
			{ 'domain_name' : config.get('app.issuer'), 'object' : apiDom }
		]
	};

	return domains;
}