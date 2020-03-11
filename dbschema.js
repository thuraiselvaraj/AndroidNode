var mongoose = require("mongoose");
var userSchema= new mongoose.Schema({
   name:String,
   email:String,
   number:String,
   password:String,
   book:[
   {
   	id:{
   		type:mongoose.Schema.Types.ObjectId,
   		ref:"Parking"
   	},
   	pname:String,
   	loc:String,
   	mno:String,
   	coordinates:Array,
   	price:String,
   	hours:String,
      cname:String,
      cno:String
   }
   ]
});
module.exports = mongoose.model("User",userSchema);