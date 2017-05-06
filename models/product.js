var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var productSchema=new Schema({
	name: String,
	price: Number,
	available: Boolean,
	categories: [{type:Schema.ObjectId, ref:'Category'}],
	description: String,
	image: {data: Buffer, contentType: String}
});

module.exports=mongoose.model('Product',productSchema);