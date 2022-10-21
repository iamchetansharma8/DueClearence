module.exports = {
    ensureAuth: function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/')
        }
    },
    ensureGuest: function(req,res,next){
        if(req.isAuthenticated()){
            return res.redirect('/home')
        }else{
            return next()
        }
    }
}