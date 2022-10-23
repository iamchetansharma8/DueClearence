const User=require('../models/users');

// sign in and create a session
module.exports.createSession=async function(req,res){
    // return res.status(200).json({
    //     error: false,
    //     message: "logged In",
    //     user: req.user
    // })
    return res.redirect('/home');
}
// sign out and destroy session
module.exports.destroySession=async function(req,res,next){
    await req.logout((error)=>{
        if (error) {return next(error)}
    });
    return res.redirect('/');
}