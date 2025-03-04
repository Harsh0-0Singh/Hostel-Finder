const booking = require("../models/Booking.js");
const Listing = require("../models/listing");

module.exports.renderAdminPage = async (req, res) => {
  const userId = req.user._id;
  const allListings = await Listing.find({
    owner: userId,
  });
  res.render("users/adminPage.ejs", { allListings });
};

module.exports.showAdminListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate({
      path: "applications",
      populate: {
        path: "applicant",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing deos not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/showAdmin.ejs", { listing });
};
module.exports.applyroom = async (req, res) => {
  try {
    const userId = req.user._id;
    const hostelId = req.params.id;
    if (!hostelId) {
      req.flash("error", "Hostel not found");
      res.redirect(`/listings/${hostelId}`);
    }
    const existingApplication = await booking.find({
      Listing: hostelId,
      applicant: userId,
    });
    if (existingApplication.length != 0) {
      req.flash("error", "You have already applied");
      return res.redirect(`/listings/${hostelId}`);
    }
    const newBooking = await booking.create({
      Listing: hostelId,
      applicant: userId,
    });
    const listing = await Listing.findById(hostelId);
    listing.applications.push(newBooking._id);
    await listing.save();
    req.flash("success", "Applied for a room sucessfully");
    res.redirect(`/listings/${hostelId}`);
  } catch (error) {
    console.log(error);
  }
};
module.exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      req.flash("error", "Status is required");
      return res.render("listings/showAdmin.ejs", { listing });
    }
    const bookingId = req.params.id;
    const Booking = await booking
    .findOne({ _id: bookingId })
    .populate("Listing");
    if (!Booking) {
      req.flash("error", "Application not found");
      return res.render("listings/showAdmin.ejs", { listing });
    }
  const hostelId = Booking.Listing._id;
    let listing = await Listing.findById(hostelId);

   
    
    Booking.status = status.toLowerCase();
    await Booking.save();
    listing = await Listing.findById(hostelId)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
        },
      })
      .populate("owner");
    req.flash("success", "Status updated successfully");
    return res.render("listings/showAdmin.ejs", { listing });
  } catch (error) {
    console.log(error);
  }
};
module.exports.showStatus = async(req,res)=>{
 try{
  const userId = req.user._id;
  let userBookings = await booking.find({applicant:userId}).populate("Listing");
  console.log(userBookings);
  return res.render("listings/showBooking.ejs",{userBookings})
 }catch(error){
  console.log(error);
 }
};