var jwt = require("jsonwebtoken");
var config = require("../config");
function verifyToken(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ error: true, message: "No token provided." });
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err)
      return res
        .status(401)
        .send({ error: true, message: "Failed to authenticate token." });
    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;
