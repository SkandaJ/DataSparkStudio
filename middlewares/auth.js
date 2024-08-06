const {getUser} = require('../service/auth');
const {getDev} = require('../service/auth')

async function restrictToLoggedInUserOnly(req, res, next) {
    const token = req.cookies?.uid;

    if (!token) {
        console.log('No token found, redirecting to login');
        return res.redirect('/login');
    }

    try {
        const user = getUser(token);
        if (!user) {
            console.log('Invalid token, redirecting to login');
            return res.redirect('/login');
        }

        req.user = user;
        console.log('User set in req:', req.user);
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.redirect('/login');
    }
}

async function restrictToLoggedInDevOnly(req, res, next){
    const devUid = req.cookies?.did;
    if(!devUid) return res.redirect('/login');
    const dev = getDev(devUid);
    if(!dev) return res.redirect('/login');
    req.dev=dev;
    next();
}

async function UserAuth(req, res, next){
    const userUid = req.cookies?.uid;
    const user = getUser(userUid);
    req.user=user;
    next();
}

async function DevAuth(req, res, next){
    const devUid = req.cookies?.did;
    const dev = getDev(devUid);
    req.dev=dev;
    next();
}

module.exports={
    restrictToLoggedInUserOnly,
    UserAuth,
    restrictToLoggedInDevOnly,
    DevAuth,
}