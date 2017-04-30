var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var categorySchema=new Schema({
	name: String
});

categorySchema.save(function(err){
	if(err) return next(err);
	next();
});

module.exports=mongoose.model('category',categorySchema);