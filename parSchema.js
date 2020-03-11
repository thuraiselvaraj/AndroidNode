var mongoose = require("mongoose");
var parOwnerSchema= new mongoose.Schema({
   name:String,
   email:String,
   pname:String,
   slots:String,
   loc:String,
   mno:String,
   price:String,
   coordinates:Array,
   password:String,
   customers:[
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
module.exports = mongoose.model("parOwner",parOwnerSchema);