const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}

module.exports.sortByIncPrice = async(req,res)=>{
  const allListings = await Listing.find()
  .sort({ price: 1 });
  res.render("listings/index.ejs", { allListings });
}
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}
module.exports.sortByDecPrice = async(req,res)=>{
  const allListings = await Listing.find()
  .sort({ price: -1 });
  res.render("listings/index.ejs", { allListings });
}
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews", 
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing deos not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send() 

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/booking/admin");
  }

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing deos not exist!");
      res.redirect("/booking/admin");
    }

    let originalImageurl = listing.image.url;
    originalImageurl =  originalImageurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalImageurl });
  };

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename}
  await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/booking/admin/${id}`);
}


module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  console.log("Deleted one");
  req.flash("success", "Listing Deleted!");
  res.redirect("/booking/admin");
}