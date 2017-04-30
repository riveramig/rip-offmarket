var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');

var UserSchema=new Schema({
	name:String,
	username:{type:String,required:true},
	email:{type:String,required:true},
	password:{type:String,required:true,select:false}
});

UserSchema.pre('save',function(next){
	var user=this;
	if(!user.isModified('password')) return next();
			bcrypt.hash(user.password,null,null,function(err,hash){
				if(err) return next(err);
				
				user.password=hash;
				next();
	});
});

UserSchema.methods.comparePassword=function(password, hash, callback){
	bcrypt.compare(password, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}

module.exports.getUserByUsername = function(userrname, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(userrname, callback){
	User.findById(id, callback);
}



module.exports=mongoose.model('User',UserSchema);