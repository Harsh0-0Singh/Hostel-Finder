const express = require("express");
const { isOwner, isLoggedIn } = require("../middleware");
const { applyroom, getApplicants, updateStatus, renderAdminPage, showAdminListing, showStatus } = require("../controllers/booking");
const router = express.Router();
router.route("/admin").get(  isLoggedIn,renderAdminPage);
router.route("/admin/:id").get(showAdminListing);
router.route("/apply/:id").get(isLoggedIn,applyroom);
router.route("/showStatus").get(isLoggedIn,showStatus);
// router.route("/:id/applicants").get(isLoggedIn,isOwner,getApplicants);
router.route("/status/:id/update").post(isLoggedIn,updateStatus);

module.exports = router;