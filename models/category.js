var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var Product = require('./product');

var categorySchema=new Schema({
	name:{type:String, required:true},
});


module.exports=mongoose.model('Category',categorySchema);