var mongoose = require("mongoose");
var hosOwnerSchema= new mongoose.Schema({
   name:String,
   email:String,
   pname:String,
   loc:String,
   mno:String,
   coordinates:Array,
   password:String
});
module.exports = mongoose.model("hosOwner",hosOwnerSchema);