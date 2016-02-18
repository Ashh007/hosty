var userManager = require('../models/users');

exports.create = function(req, res) {

    userManager.create(req.body, function(err, doc) {
        if(err) {
            return res.json({error: err});
        }
        res.json(doc);
    });
};
