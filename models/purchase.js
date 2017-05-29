var mongoose = require('mongoose');
var Product = require('./product');
var User = require('./user');
var Schema = mongoose.Schema;

var purchaseSchema = new Schema({
	date: Date,
	products: [{type:String}],
	owner: {type:String, required:true}
});

module.exports=mongoose.model('Purchase',purchaseSchema);