var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');

var UserSchema=mongoose.Schema({
	name:String,
	username:{type:String,required:true},
	email:{type:String,required:true},
	password:{type:String,required:true}
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

var User= module.exports = mongoose.model('User',UserSchema);


module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}


module.exports.comparePassword=function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}

