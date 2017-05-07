var mongoose=require('mongoose');
var Category = require('./category');
var Schema=mongoose.Schema;

var productSchema=new Schema({
	name: String,
	price: Number,
	available: Boolean,
	categories: [{type:Schema.Types.ObjectId, ref:'Category'}],
	description: String,
	image: {data: Buffer, contentType: String}
});

module.exports=mongoose.model('Product',productSchema);