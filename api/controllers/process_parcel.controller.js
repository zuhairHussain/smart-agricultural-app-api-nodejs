const ProcessParcel = require("../models/process_parcel.model");
const Parcel = require("../models/parcel.model");
const Tractor = require("../models/tractor.model");

exports.create_process_parcel = async function (req, res, next) {
  const { tractor, parcel, area } = req.body;

  if (tractor && parcel && area) {

    const findTractor = await Tractor.find({ _id: tractor }).exec();
    const findParcel = await Parcel.find({ _id: parcel }).exec();

    if (findTractor.length && findParcel.length) {
      if (area <= findParcel[0].area) {
        let processParcel = new ProcessParcel({
          tractor,
          parcel,
          area
        });
        processParcel.save(function (err, parcel) {
          if (err) {
            console.log(err, "err")
            return next(err);
          } else {
            res.status(200).send({ error: false, parcel });
          }
        });
      } else {
        res.status(500).send({ error: false, message: "Area should not exceed the area of the selected parcel" });
      }
    } else {
      res.status(500).send({ error: false, message: "Invalid Information" });
    }
  } else {
    res.status(500).send({ error: true, message: "Invalid Information" });
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