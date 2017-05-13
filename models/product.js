var mongoose=require('mongoose');
var Category = require('./category');
var Schema=mongoose.Schema;

var productSchema=new Schema({
	name: String,
	price: Number,
	available: Boolean,
	categories: [{type: String}],
	description: String,
	image: {data: String, contentType: String}
});

module.exports=mongoose.model('Product',productSchema);