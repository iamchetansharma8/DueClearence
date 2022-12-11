const GoogleStrategy=require('passport-google-oauth20').Strategy
const mongoose=require('mongoose')
const User=require('../models/users')

module.exports=function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done)=>{
        let isGodLevelAdmin=false;
        console.log("called");
        if(profile.emails[0].value=='195001@nith.ac.in')isGodLevelAdmin=true;
        const newUser={
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            isGodLevelAdmin : isGodLevelAdmin
        }
        
        try{
            let user=await User.findOne({googleId: profile.id})
            if(user){
                done(null, user)
            }else{
                user =await User.create(newUser)
                done(null, user)
            }
        }catch(err){
            console.error(err)
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id, (err, user) => done(err,user))
    })
}