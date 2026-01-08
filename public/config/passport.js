import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../models/Users.js'


export async function configurePassport() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({googleId: profile.id})

                    if(user) {
                        return done(null, user)
                    }

                    const newUser = await User.create({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        role: 'user',
                        department: null
                    })

                    return done(null, newUser)
                } catch (error) {
                    return done(error, null)
                }
            }
        )
    )
}