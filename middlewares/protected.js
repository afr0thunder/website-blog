const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
    //check if user is logged in
    if(req.session.userAuth) {
        next()
    } else {
        res.render("users/notAuthorized.ejs")
    }
};

module.exports = protected;