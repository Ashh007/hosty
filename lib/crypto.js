var crypto = require('crypto');

function encrypt(algorithm, secret, text) {
    var cipher = crypto.createCipher(algorithm, secret);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(algorithm, secret, text) {
    var decipher = crypto.createDecipher(algorithm, secret);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

exports.crypto = {};
exports.crypto.encrypt = encrypt;
exports.crypto.decrypt = decrypt;