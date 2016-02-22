var mongoose = require('mongoose');
var config = require('config');
var algorithm = config.get('app.cryptoAlgorithm');
var appSecret = config.get('app.secret');
var ObjectId = mongoose.Types.ObjectId;
var errors = '';

exports.create = function(data, cb) {

    if(!data) {
        return cb({message: userManagerErrorCodes.EMPTY_USER_DATA});
    }

    if(!data.password || typeof data.password !== 'string') {
        return cb({message: userManagerErrorCodes.INVALID_OR_EMPTY_PASSWORD});
    }

    if(data.password.length < 8 || data.password.length > 18) {
        return cb({message: userManagerErrorCodes.PASSWORD_MUST_HAVE_LENGTH_OF_8_TO_18});
    }

    data.password = utils.crypto.encrypt(algorithm, appSecret, data.password);

    var user = new UserModel(data);
    user.status = 'registered';

    user.save(function(err, doc) {
        if (err) {
            var errorResponse = {};
            if (err.name) {
                if (err.name === 'ValidationError') {
                    errorResponse.type = 'ValidationError';
                    var errors = err.errors;
                    for (var validationErrorField in errors) {
                        if (errors.hasOwnProperty(validationErrorField)) {
                            errorResponse.field = validationErrorField;
                            errorResponse.message = errors[validationErrorField].message;
                        }
                    }
                    return cb(errorResponse);
                }
            }
            return cb({message: mongoErrorCodes.UNKNOWN_DB_ERROR});
        }
        cb(null, doc._id);
    });
};

exports.authenticate = function(usernameOrEmail, password, cb) {

    password = utils.crypto.encrypt(algorithm, appSecret, password + '');

    UserModel.findOne({$or: [{username: usernameOrEmail}, {email: usernameOrEmail}], password: password}).select('_id username email firstname lastname').exec(function(err, doc) {
        if(err) {
            return cb({message: mongoErrorCodes.UNKNOWN_DB_ERROR});
        }
        if(!doc) {
            return cb({message: userManagerErrorCodes.AUTHENTICATION_FAILED});
        }
        var token = authManager.generateToken(doc._id.toString(), {});
        cb(null, doc, token);
    });
};