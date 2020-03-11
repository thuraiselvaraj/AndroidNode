var mongoose = require("mongoose");
var foodInfoSchema= new mongoose.Schema({
   name:String,
   loc:String,
   coordinates:Array,
   mno:String,

});
module.exports = mongoose.model("Food",foodInfoSchema);