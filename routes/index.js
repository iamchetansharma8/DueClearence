const express= require('express')
const router=express.Router()
const {ensureAuth,ensureGuest}=require('../middleware/auth')

// login page
router.get('/', ensureGuest, (req,res)=>{
    res.send("<a href='/auth/google'> Log In With Google </a>")
});

router.get('/home',ensureAuth, (req,res)=>{
    res.send('Home')
})

router.use('/auth', require('./auth.js'))
router.use('/department', require('./department'))
router.use('/superadmin', require('./superadmin'))
router.use('/due', require('./due'))
module.exports=router;