const Parcel = require("../models/parcel.model");
const ProcessParcel = require("../models/process_parcel.model");

exports.create_parcel = function (req, res, next) {
  const { name, culture, area } = req.body;

  if (name && culture && area) {
    let parcel = new Parcel({
      name,
      culture,
      area
    });
    parcel.save(function (err, parcel) {
      if (err) {
        return next(err);
      } else {
        res.status(200).send({ error: false, parcel });
      }
    });
  } else {
    res.status(500).send({ error: true, message: "Invalid Information" });
  }
};

exports.all_parcels = function (req, res, next) {
  Parcel.find({}, function (err, parcel) {
    if (err) {
      return next(err);
    } else {
      res.status(200).send({ error: false, parcel });
    }
  });
};

exports.all_parcels_report = function (req, res, next) {
  ProcessParcel.aggregate([
    {
      $group: {
        _id: '$parcel',
        totalAreasProcessed: { $sum: { $add: ["$area"] } }
      }
    }
  ]).exec(function (err, parcel) {
    if (err) {
      return next(err);
    } else {
      res.status(200).send({ error: false, parcel });
    }
  });
  // ProcessParcel.find({}, function (err, parcel) {
  //   if (err) {
  //     return next(err);
  //   } else {
  //     Appointments.aggregate([
  //       { $group: { _id: '$date', patients: { $push: '$patient' } } },
  //       { $project: { date: '$_id', patients: 1, _id: 0 } }
  //     ], ...)
  //     res.status(200).send({ error: false, parcel });
  //   }
  // });
};