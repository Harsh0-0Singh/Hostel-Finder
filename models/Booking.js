const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookingSchema = new mongoose.Schema({
Listing:{
    type:Schema.Types.ObjectId,
    ref:"Listing",
    required:true
},
applicant:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
status:{
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:'pending'
    }
},{timestamps:true});
 const booking  = mongoose.model("booking", bookingSchema);
 module.exports=booking;