//jshint esversion:7
module.exports = {
    userAuthenticated: (req, res, next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/');
    }
};