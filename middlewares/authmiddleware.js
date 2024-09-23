const { validateToken } = require("../Services/authentication");

function checkForAuthenticationCookie(cookieName) { // cookieName : 'token'
    return (req, res, next) => {
        const cookieTokenValue = req.cookies[cookieName]; // it contain token value:
        // if cookie not exist, then call next function:
        if(!cookieTokenValue) return next();
        try{
            const userPayload = validateToken(cookieTokenValue)
            req.user = userPayload;
        }catch(e) {}

        return next()
    }; 
}
module.exports = checkForAuthenticationCookie; 