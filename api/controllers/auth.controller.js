var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../../config");
const User = require("../models/user.model");
const { ErrorHandler } = require('../../helpers/error');

exports.user_create = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email) throw new ErrorHandler(404, 'Email field is required.');
    if (!password) throw new ErrorHandler(404, 'Password field is required.');

    await User.findOne({
      email: email
    })
      .then(userData => {
        if (userData) {
          throw new ErrorHandler(404, `The email address ${userData.email} is already in use.`);
        }

        var hashedPassword = bcrypt.hashSync(password, 8);
        var user = new User({
          email: email,
          password: hashedPassword
        });

        user.save(function (err, user) {
          var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });

          if (err) {
            next(err)
          } else {
            res.status(200).send({ token });
          }
        });
      });
  } catch (error) {
    next(error)
  }
};

exports.user_login = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email) throw new ErrorHandler(404, 'Email field is required.');
    if (!password) throw new ErrorHandler(404, 'Password field is required.');

    const foundUser = await User.findOne({ email: email });
    if (!foundUser) throw new ErrorHandler(404, 'No user found');

    const passwordIsValid = await compareAsync(password, foundUser.password);
    if (!passwordIsValid) throw new ErrorHandler(404, 'Invalid email or password provided!');
    var token = jwt.sign({ id: foundUser._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ error: false, token: token, user: { email: foundUser.email } });
    next()
  } catch (error) {
    next(error)
  }
};

function compareAsync(pass, hash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(pass, hash, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}