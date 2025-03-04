const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  //await mongoose.connect("mongodb+srv://harshsingh9hrs:kUYvoykb2CpkPAns@cluster0.8ino1.mongodb.net/Wanderlust?retryWrites=true&w=majority&appName=Cluster0");
  
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj) => ({ ...obj, owner: "675529fb7f9f785f01a53499" }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};
initDB();
