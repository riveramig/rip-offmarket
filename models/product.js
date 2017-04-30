var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var productSchema=new Schema({
	name: String,
	price: Number,
	available: Boolean,
	categories: [{type: Schema.Types.ObjectId, ref: 'User'}],
	description: String,
	image: {data: Buffer, contentType: String}
});

productSchema.save(function(err){
	if(err) return next(err);
	next();
});

module.exports=mongoose.model('Product',productSchema);