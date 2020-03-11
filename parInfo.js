var mongoose = require("mongoose");
var parInfoSchema= new mongoose.Schema({
   name:String,
   loc:String,
   coordinates:Array,
   slots:String,
   mno:String,
   price:String
});
module.exports = mongoose.model("Parking",parInfoSchema);