/**
 * To make a authentication follow these steps:
 * -> make a dir `Services`
 * -> jwt from jsonwebtoken
 * -> make a `Secret Key`
 * -> Create a token for the user. (`createTokenForUser`)
 * -> Create a payload for the token
 * -> jwt.sign(payload, secret)
 */

const JWT = require('jsonwebtoken');
const Secret = 'callmepandeyji'

function createTokenForUser(user) {
    // make payload from the user data:
    const payload = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    // make a token by passing { token, secret }
    const token = JWT.sign(payload, Secret);
    return token;
}

function validateToken(token) {
    // will return a payload from the token:
    const payload = JWT.verify(token, Secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}