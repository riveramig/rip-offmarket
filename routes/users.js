var express = require('express');
var User = require('../models/user');
var config = require('../config');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/signup',function(req,res){
	User.findOne({username: req.body.username, email: req.body.email},function(err,person){
		if(!person){
			var user=new User({
				name: req.body.name,
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			});
			user.save(function(err){
				if(err){
					console.log(err);
				}else{
					res.json({message: 'User created'+req.body.username});
				}
			});
		}else{
			res.json({message: 'Username or email already in use!'});
		}
	});
});

router.post('/login',function(req,res){
	var username=req.body.username;
	var password=req.body.password;
	User.findOne({username:username},function(err,user){
		if(!user){
			res.json({message: 'Username invalid'});
		}else{
			if(User.comparePassword(password)){
				res.json({message: 'Do stuff --------------------------------'});
			}else{
				res.json({message: 'Password invalid'});
			}
		}
	});
});
module.exports = router;