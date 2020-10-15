const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {

    try {
        if (!email) {
            throw new Error('Укажите email');
        }
        let user = await User.findOne({email});
        if (!user) {
            user = await User.create({email, displayName});
        }
        return done(null, user);
    } catch (e) {
        done(e);
    }
};
