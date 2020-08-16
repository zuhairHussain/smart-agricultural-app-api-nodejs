var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../../config");

const User = require("../models/user.model");

exports.user_create = function (req, res, next) {
  if (req.body.email && req.body.password) {
    User.findOne({
      email: req.body.email
    })
      .then(doc => {
        if (doc) {
          res.status(200).json({ error: `The email adress ${doc.email} is already in use.` });
        } else {
          var hashedPassword = bcrypt.hashSync(req.body.password, 8);
          var user = new User({
            email: req.body.email,
            password: hashedPassword
          });

          user.save(function (err, user) {
            var token = jwt.sign({ id: user._id }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });

            if (err) {
              res.status(500).send({ error: "Account not created please try again! " + err });
            } else {
              res.status(200).send({ token });
            }
          });
        }
      });
  } else {
    res.status(500).send("Invalid Information");
  }
};

exports.user_login = function (req, res, next) {
  if (req.body.email && req.body.password) {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send({ error: true, message: "Error on the server." });
      if (!user) return res.status(401).send({ error: true, message: "Invalid email or password!" });
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid)
        return res.status(401).send({ error: true, message: "Invalid email or password!" });
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ error: false, token: token, user: { email: user.email } });
    });
  } else {
    res.status(401).send({ error: true, message: "Email and Password are required!" });
  }
};

exports.me = function (req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ error: true, message: "No token provided." });

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ error: true, message: "Failed to authenticate token." });

    User.findById(decoded.id, { password: 0, _id: 0 }, function (err, user) {
      if (err)
        return res.status(500).send({ error: true, message: "There was a problem finding the user." });
      if (!user) return res.status(404).send({ error: true, message: "No user found." });

      res.status(200).send({ error: false, user });

    });
  });
};