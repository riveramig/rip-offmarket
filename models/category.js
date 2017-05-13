var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var Product = require('./product');

var categorySchema=new Schema({
	name:{type:String, required:true},
});

var Category= module.exports=mongoose.model('Category',categorySchema);


module.exports.getId=function(nameCate,callback){
	var query = {name:nameCate};
	Category.findOne(query,'_id', function(err,id){
		if(err) throw err;
		callback(null,id);
	});
}

