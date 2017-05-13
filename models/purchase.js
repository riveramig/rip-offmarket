var mongoose = require('mongoose');
var Product = require('./product');
var User = require('./user');
var Schema = mongoose.Schema;

var purchaseSchema = new Schema({
	date: Date,
	products: [{type:Schema.Types.ObjectId,ref:'Product'}],
	price: Number,
	owner: {type:Schema.Types.ObjectId, ref:'User'}
});

module.exports=mongoose.model('Purchase',purchaseSchema);