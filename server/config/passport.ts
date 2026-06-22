import passport from 'passport'
import { Strategy as GoogleStrategy,Profile, VerifyCallback  } from 'passport-google-oauth20'
import { User } from '../models/Users.js'


export async function configurePassport() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
            },
            async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
                try {
                    let user = await User.findOne({googleId: profile.id})

                    if(user) {
                        return done(null, user)
                    }

                    const existingEmailUser = await User.findOne({ 
                        email: profile.emails?.[0]?.value
                    })

                    if (existingEmailUser) {
                        existingEmailUser.googleId = profile.id
                        await existingEmailUser.save()
                        return done(null, existingEmailUser)
                    }

                    const newUser = await User.create({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails?.[0].value,
                        role: 'user',
                        department: null
                    })

                    return done(null, newUser)
                } catch (error) {
                    return done(error, false)
                }
            }
        )
    )
}