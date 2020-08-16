const Parcel = require("../models/parcel.model");
const ProcessParcel = require("../models/process_parcel.model");
const { ErrorHandler } = require('../../helpers/error');

exports.create_parcel = function (req, res, next) {
  try {
    const { name, culture, area } = req.body;
    if (!name || !culture || !area) {
      throw new ErrorHandler(404, 'Invalid Information Provided!');
    }

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
  } catch (error) {
    next(error)
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

exports.get_parcels_by_id = function (req, res, next) {
	try {
		const { id } = req.params;
		if (!id) throw new ErrorHandler(404, 'ID is required!');

		ProcessParcel.find({parcel: id}, function (err, parcel) {
			if (err) {
			  return next(err);
			} else {
			  res.status(200).send({ error: false, parcel });
			}
		})
		.populate('tractor parcel');;
  } catch (error) {
    next(error)
  }
};

exports.processed_parcels_area = function (req, res, next) {
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
};