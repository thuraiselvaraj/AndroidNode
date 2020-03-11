var mongoose = require("mongoose");
var warInfoSchema= new mongoose.Schema({
   name:String,
   loc:String,
   coordinates:Array,
   mno:String,

});
module.exports = mongoose.model("Workshop",warInfoSchema);