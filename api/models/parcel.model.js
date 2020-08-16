const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ParcelSchema = new Schema({
    name: { type: String, required: true, max: 100 },
    culture: { type: String, required: true, max: 100 },
    area: { type: Number, required: true },
});

module.exports = mongoose.model('Parcel', ParcelSchema);