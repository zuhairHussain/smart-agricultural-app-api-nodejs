const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", UserSchema);
