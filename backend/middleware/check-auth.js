const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
try{
  const token = req.headers.authorization.split(" ")[1];
const decode=jwt.verify(token, "secret_this_should_be_longer");
req.userData = {email: decode.email, userId: decode.userId};
next();
} catch (error) {
res.status(401).json({message: 'You are Not Authenticated!'});
}
};
