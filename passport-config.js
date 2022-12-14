const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserBySchullerID, getUserById){
    //function to authenticate user
    const authenticateUsers = async (schullerID, password, done) => {
        //Get User by SchullerID
        const user = getUserBySchullerID(schullerID)
        if(user == null){
            return done(null, false, {message: "No user found with that ID"});
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {message: "Password incorrect"});
            }
        } catch (e) {
            console.log(e);
            return done(e);    
        }
    }

    passport.use(new LocalStrategy({usernameField: 'schullerID'}, authenticateUsers));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    });
}

