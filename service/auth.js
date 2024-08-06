const sessionIdUserMap = new Map();
const sessionIdDeveloperMap  = new Map();
const jwt = require('jsonwebtoken')
const secret = "User#123@";

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secret, { expiresIn: '1h' });
}

function getUser(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

function setDev(id, dev){
    sessionIdDeveloperMap.set(id, dev);
}

function getDev(id){
    return sessionIdDeveloperMap.get(id);
}
module.exports={
    setUser,
    getUser,
    setDev,
    getDev,
}