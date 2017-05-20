var express = require('express');
var router = express.Router();
var Product = require('../models/product');

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: 'Tienda sin autenticar', User: undefined });
});

router.get('/users', ensureAuthenticated,function(req, res, next) {
	var usuario=undefined;
	if (req.user.local.name != undefined) {
		usuario=req.user.local.name;
	} else if (req.user.facebook.name != undefined) {
		usuario=req.user.facebook.name;
	} else if (req.user.twitter.displayName != undefined) {
		usuario=req.user.twitter.displayName;
	} else {
		usuario=req.user.google.name;
	}
	console.log(usuario);
	
  res.render('index', { title: 'Tienda Autenticada el Usuarios es:', User: usuario });
});

router.get('/cart', ensureAuthenticated,function(req, res, next){
  var usuario=undefined;
	if (req.user.local.name != undefined) {
		usuario=req.user.local.name;
	} else if (req.user.facebook.name != undefined) {
		usuario=req.user.facebook.name;
	} else if (req.user.twitter.displayName != undefined) {
		usuario=req.user.twitter.displayName;
	} else {
		usuario=req.user.google.name;
	}
	console.log(usuario);
	
  res.render('cart', { title: 'Tienda Autenticada el Usuarios es:', User: usuario });
});

router.get('/login',function(req,res){
	res.render('register', {errors:false, success_msg:false});
});

router.get('/checkout',function(req,res){
	res.render('checkout', { title: 'Tienda sin autenticar', User: undefined });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next(); 
	}else{
		req.flash('error', 'No esta registrado Para acceder a esa ruta');
		res.redirect('/users/login');
	}

}

router.get('/products',function(req,res){
	Product.find({},function(err,products){
		if(err){
			console.log(err)
		}
		res.json(products);
	});
});

module.exports = router;