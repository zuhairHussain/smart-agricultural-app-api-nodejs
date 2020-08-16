const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ParcelSchema = new Schema({
    tractor: { type: Schema.Types.ObjectId, ref: "Tractor", required: true },
    parcel: { type: Schema.Types.ObjectId, ref: "Parcel", required: true },
    date: { type: Date, required: true, default: Date.now },
    area: { type: Number, required: true },
});

module.exports = mongoose.model('ProcessParcel', ParcelSchema);