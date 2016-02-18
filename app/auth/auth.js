var jwt = require('jsonwebtoken');
var config = require('config');
var appSecret = config.get('app.secret');
var tokenExpiresIn = config.get('app.auth.expires');
var tokenIssuer = config.get('app.auth.issuer');
var authManagerErrorCodes = require('../../config/errorCodes/authManager');

exports.generateToken = function(userId, options) {
	var token = jwt.sign({
		auth : userId.toString()
	}, appSecret, {
		expiresInMinutes : options.expires || tokenExpiresIn,
		issuer: tokenIssuer
	});
	return token;
};

exports.verifyToken = function(token) {
	var decoded = false;
	try {
		decoded = jwt.verify(token, appSecret);
	} catch (e) {
		if (e.message === 'invalid signature') {
			return {
				__error : authManagerErrorCodes.INVALID_SIGNATURE
			};
		}
		if (e.message === 'jwt expired') {
			return {
				__error : authManagerErrorCodes.TOKEN_EXPIRED
			};
		}
		if (e.message === 'jwt malformed') {
			return {
				__error : authManagerErrorCodes.TOKEN_MALFORMED
			};
		}
		if(e.message === 'jwt signature is required') {
			return {
				__error : authManagerErrorCodes.SIGNATURE_REQUIRED
			};
		}
	}
	return decoded;
};
