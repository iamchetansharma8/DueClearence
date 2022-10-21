const express= require('express')
const router=express.Router()
const {ensureAuth,ensureGuest}=require('../middleware/auth')

// login page
router.get('/', ensureGuest, (req,res)=>{
    res.send("<a href='/auth/google'> Log In With Google </a>")
});

router.get('/home',ensureAuth, (req,res)=>{
    console.log(req.user)
    res.send('Home')
})

router.use('/auth', require('./auth.js'))
module.exports=router;