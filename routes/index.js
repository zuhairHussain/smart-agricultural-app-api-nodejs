const express = require("express");
const router = express.Router();
var VerifyToken = require("../helpers/VerifyToken");

const parcel_controller = require("../api/controllers/parcel.controller");
const tractor_controller = require("../api/controllers/tractor.controller");
const process_parcel_controller = require("../api/controllers/process_parcel.controller");
const auth_controller = require("../api/controllers/auth.controller");

router.post("/parcel/create", VerifyToken, parcel_controller.create_parcel);
router.get("/parcels", VerifyToken, parcel_controller.all_parcels);
router.get("/process-parcels-area", VerifyToken, parcel_controller.processed_parcels_area);
router.get("/process-parcels-by-id/:id", VerifyToken, parcel_controller.get_parcels_by_id);

router.post("/tractor/create", VerifyToken, tractor_controller.create_tractor);
router.get("/tractors", VerifyToken, tractor_controller.all_tractors);

router.post("/process-parcel/create", VerifyToken, process_parcel_controller.create_process_parcel);
router.get("/process-parcels", VerifyToken, process_parcel_controller.all_process_parcels);



router.post("/register", auth_controller.user_create);
router.post("/login", auth_controller.user_login);

module.exports = router;
