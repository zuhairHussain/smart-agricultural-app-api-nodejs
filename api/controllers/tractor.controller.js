const Tractor = require("../models/tractor.model");
const { ErrorHandler } = require('../../helpers/error');

exports.create_tractor = function (req, res, next) {
  try {
    const { name } = req.body;
    if (!name) throw new ErrorHandler(404, 'Name field is required!');

    let tractor = new Tractor({ name });
    tractor.save(function (err, tractor) {
      if (err) {
        return next(err);
      } else {
        res.status(200).send({ error: false, tractor });
      }
    });
  } catch (error) {
    next(error);
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