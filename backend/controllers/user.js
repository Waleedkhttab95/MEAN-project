const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.createUser = (req ,res,next) =>{
  bcrypt.hash(req.body.password, 10)
  .then(hash =>{
    const user = new User({
      email: req.body.email,
      password:hash
      });
      user.save()
      .then(result =>{
  res.status(201).json({
  message: 'User created!',
  result: result
  });
      })
      .catch(err =>{
  res.status(500).json({
  error: {
    message: 'Invalid Email !! Is Ready Exist'
  }
  });
      });
  });

  };

exports.userLogin = (req,res,next) =>{
  let fetchUser;
User.findOne({email: req.body.email})
.then(user =>{
  if(!user) {
    return res.status(401).json({
message: "Auth failed"
    });
  }
  fetchUser = user;
  return bcrypt.compare(req.body.password, user.password);
})
.then(result => {
  if(!result) {
    return res.status(401).json({
message: "Auth failed"
    });
  }
const token = jwt.sign({email: fetchUser.email, userId: fetchUser._id},
"secret_this_should_be_longer",
{expiresIn: "1h"});
res.status(200).json({
token: token,
userId: fetchUser._id
});
})
.catch(err => {

    return res.status(401).json({
message: "Auth failed"
    });

});
};
