const jwt = require('jsonwebtoken')
const jwt_auth_secret = "$#%^*&(%%^&^%&%#"

exports.AuthValidationMiddleware = (req,res,next) => {
  try {
    const auth_token = req.headers['authorization'] || ''
    if(!auth_token || !auth_token.startsWith('Bearer ')){
        throw new Error("Please login first")
    }

    const token = auth_token.split(' ')[1]
    if(!token){
        throw new Error("Enter valid token")
    }
    
    const payload = jwt.verify(token, jwt_auth_secret)
    req.user= payload.userId
    next()
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}
