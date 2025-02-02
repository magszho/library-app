import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';

export default function configurePassport(passport: passport.PassportStatic) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken: string, refreshToken: string, profile: any, callback: any) => {
    const newUser = {
      googleId: profile.id,
      name: profile.displayName,
    //   firstName: profile.name.givenName,
    //   lastName: profile.name.familyName,
      email: profile.emails[0].value,
    };
    console.log(newUser);

    try {
      let user = await User.findOne({googleId: profile.id});
      if (user) {
        return callback(null, user);
      } else {
        user = (await User.create(newUser));
        return callback(null, user);
      }
    } catch (err) {
      console.log(err);
      return callback(err, null);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}