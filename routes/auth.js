const express= require('express');
const passport = require('passport');
const router=express.Router()
const userController=require('../controllers/user_controller.js')
const CLIENT_URL = "http://localhost:3000"

router.get("/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

// auth with google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {successRedirect: CLIENT_URL,failureRedirect: '/failed'})), 
router.get("/login/success", (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
        //   cookies: req.cookies
      });
    }
  });

router.get('/logout', userController.destroySession);

// google auth callback
// GET /auth/google/callback
// router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), 
// (req,res)=>{
//     res.redirect('/home')
// });

// logout user
// /auth/logout



/*router.get('/logout', (req, res, next) => {
    req.logout((error)=>{
        if (error) {return next(error)}
        res.redirect('/')
    });  
})*/




module.exports=router;