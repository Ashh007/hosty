var mongoose = require('mongoose');
var userManager = require('../users');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username : {type: String, required: true},
    password : {type: String, required: true},
    firstname : {type: String, required: true},
    lastname : {type: String, required: true},
    email : {type: String, required: true},
    mobile : {type: Number, required: true, min: 10, max: 10},
    about : {type: String},
    social : {
        facebook : {
            uid : String,
            token : String
        },
        twitter : {
            uid : String,
            token : String,
            screenName : String
        }
    },
    gender : {type: String, 'enum': ['male', 'female']},
    address : {
        area : {type: String, required: true},
        city : {type: String, required: true},
        state : {type: String, required: true},
        zip : {type: String, required: true},
        street : {type: String, required: true}
    },
    status : {type: String, 'enum': ['registered', 'active', 'suspended', 'terminated']},
    createdAt : {type: Date, default: Date.now},
    updatedAt : {type: Date, default: Date.now}
});

var UserModel = mongoose.model('User', UserSchema);


UserModel.schema.path('username').validate(function(value) {
    if(!value.length) {
        return false;
    }
    if(value.length > 8) {
        return false;
    }
    return true;
}, 'Username must have 8 characters');

UserModel.schema.path('username').validate(function(value, cb) {
    userManager.isUserExistsWithUsername(value, function(err, exists) {
        cb(!exists);
    });
}, 'Username must be unique');

UserModel.schema.path('firstname').validate(function(value) {
    if(!value.length) {
        return false;
    }
    if(value.length < 2) {
        return false;
    }
    if(value.length > 18) {
        return false;
    }
    return true;
}, 'FirstName must have between 2 to 8 characters');

UserModel.schema.path('lastname').validate(function(value) {
    if(!value.length) {
        return false;
    }
    if(value.length < 2) {
        return false;
    }
    if(value.length > 18) {
        return false;
    }
    return true;
}, 'LastName must have between 2 to 8 characters');

UserModel.schema.path('email').validate(function(value) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(value);
}, 'Email must be valid');

module.exports = UserModel;
