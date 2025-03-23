const passport = require("passport");
const MicrosoftStrategy = require("passport-microsoft").Strategy;
require("dotenv").config();

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
      scope: ["user.read"],
      tenant: process.env.TENANT_ID || "common",
    },
    (accessToken, refreshToken, profile, done) => {
      // Verifica que el correo termine en @intec.edu.do
      const email = profile._json.mail || profile._json.userPrincipalName;
      if (!email || !email.endsWith("@intec.edu.do")) {
        return done(null, false, { message: "Acceso solo permitido para correos INTEC" });
      }
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
