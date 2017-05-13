var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var Purchase = require('./purchase');

var UserSchema=mongoose.Schema({
	local:{
		name:String,
		username:{type:String,required:true},
		email:{type:String,required:true},
		password:{type:String,required:true}
	},
	facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter:{
    	id           : String,
        token        : String,
        username     : String,
        displayName  : String
    },
    google:{
    	id           : String,
        token        : String,
        name         : String,
        email        : String
    }
});

UserSchema.pre('save',function(next){
	var user=this;
	if(!user.isModified('local.password')) return next();
			bcrypt.hash(user.local.password,null,null,function(err,hash){
				if(err) return next(err);
				
				user.local.password=hash;
				next();
	});
});

var User= module.exports = mongoose.model('User',UserSchema);


module.exports.getUserByUsername = function(username, callback){
	var query = {'local.username':username};
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