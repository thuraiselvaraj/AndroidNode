var mongoose = require("mongoose");
var hosInfoSchema= new mongoose.Schema({
   name:String,
   loc:String,
   coordinates:Array,
   mno:String,
 
});
module.exports = mongoose.model("Hospital",hosInfoSchema);