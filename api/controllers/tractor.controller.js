const Tractor = require("../models/tractor.model");

exports.create_tractor = function (req, res, next) {
  const { name } = req.body;
  if (name) {
    let tractor = new Tractor({ name });
    tractor.save(function (err, tractor) {
      if (err) {
        return next(err);
      } else {
        res.status(200).send({ error: false, tractor });
      }
    });
  } else {
    res.status(500).send({ error: true, message: "Invalid Information" });
  }
};

exports.all_tractors = function (req, res, next) {
  Tractor.find({}, function (err, tractor) {
    if (err) {
      return next(err);
    } else {
      res.status(200).send({ error: false, tractor });
    }
  });
};