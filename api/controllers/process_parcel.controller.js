const ProcessParcel = require("../models/process_parcel.model");
const Parcel = require("../models/parcel.model");
const Tractor = require("../models/tractor.model");
const { ErrorHandler } = require('../../helpers/error');

exports.create_process_parcel = async function (req, res, next) {

  try {
    const { tractor, parcel, area } = req.body;
    if (!tractor || !parcel || !area) {
      throw new ErrorHandler(404, 'Invalid Information Provided!')
    }

    const findTractor = await Tractor.find({ _id: tractor }).exec();
    const findParcel = await Parcel.find({ _id: parcel }).exec();
    if (!findTractor.length || !findParcel.length) {
      throw new ErrorHandler(404, 'Invalid Information Provided!');
    }

    if (area > findParcel[0].area) {
      throw new ErrorHandler(404, 'Area should not exceed the area of the selected parcel');
    }

    let processParcel = new ProcessParcel({
      tractor,
      parcel,
      area
    });
    processParcel.save(function (err, parcel) {
      if (err) {
        return next(err);
      } else {
        res.status(200).send({ error: false, parcel });
      }
    });
  } catch (error) {
    next(error)
  }
};

exports.all_process_parcels = function (req, res, next) {
  ProcessParcel.find({}, function (err, parcel) {
    if (err) {
      return next(err);
    } else {
      res.status(200).send({ error: false, parcel });
    }
  })
    .populate('tractor parcel');
};