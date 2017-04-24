var express = require('express');
var User = require('../models/user');
var config = require('../config');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/signup',function(req,res){
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
			console.log('user: '+req.body.username+' has been created');
		}
	});
});

module.exports = router;
