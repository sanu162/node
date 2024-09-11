const jwt = require('jsonwebtoken')

module.exports = {
    signAccessToken: (personId) => {
        return new Promise((resolve, reject) => {
            jwt.sign({aud:personId}, process.env.JWT_ACCESS_SECRET, {expiresIn: "60s",issuer: 'appscrip.com'}, (err, token) => {
                if (err) reject(err)
                resolve(token)
            })
        })
    },

    signRefreshToken: (personId) => {
        return new Promise((resolve, reject) => {
            jwt.sign({aud:personId}, process.env.JWT_REFRESH_SECRET, {expiresIn: "1h",issuer: 'appscrip.com'}, (err, token) => {
                if (err) reject(err)
                resolve(token)
            })
        })
    },

    verifyAccessToken : async (artifacts, req, h) => {     
        try {         

            const token = artifacts.token;
            if (!token) {
                return res.status(403).json({message:"invalid token"});
            }            

            const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {                
                if (err) {
                    return false
                }else {
                    req.personId = payload.aud
                    return true
                }
            });

            return {isValid : data};

        } catch (error) {
            return h.response({message:error.message}).code(403);
        }
    },

    verifyRefreshToken : (refresh_token) => {    
        return new Promise((resolve, reject) => {
            jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET,  (err, paylaod) => {

                if (err) reject(err);

                resolve(paylaod.aud);
            })
        })
    }
}