var mongoose = require("mongoose");
var foodOwnerSchema= new mongoose.Schema({
   name:String,
   email:String,
   pname:String,
   loc:String,
   mno:String,
   coordinates:Array,
   password:String
});
module.exports = mongoose.model("foodOwner",foodOwnerSchema);