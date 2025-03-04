const Listing = require("../models/listing.js");
const user = require("../models/user.js");
const User = require("../models/user.js");

module.exports.renderHomepage = (req, res) => {
  res.render("users/homepage.ejs");
};

module.exports.searchHome = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    };
    const allListings = await Listing.find(query)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (allListings.length == 0) {
      req.flash("error", "Listing deos not exist!");
      res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    console.log(error);
  }
};

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;
    if(role=="Role")
    {
      req.flash("error", "Please select correct role");
      return res.redirect("/signup"); 
    }
    const newUser = new User({ email, username, role });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      if (role == "owner") {
        req.flash("success", "Welcome to Hostel Finder");
        res.redirect("/booking/admin");
      } else {
        req.flash("success", "Welcome to Hostel Finder");
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  let { role } = req.body;
 
  if (role == "owner") {
    req.flash("success", "Welcome to Hostel Finder");
    res.redirect("/booking/admin");
  } else {
    req.flash("Succcess", "Welcome  to Hostel Finder");
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
  }
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/login");
  });
};
