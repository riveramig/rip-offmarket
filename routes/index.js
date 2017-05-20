var express = require('express');
var router = express.Router();
var Product = require('../models/product');

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: 'Tienda sin autenticar', User:{name: ""}});
});

router.get('/users', ensureAuthenticated,function(req, res, next) {
  res.render('index', { title: 'Tienda Autenticada el Usuarios es:', User: req.user });
});

router.get('/cart',function(req,res){
  res.render('cart');
});

router.get('/login',function(req,res){
	res.render('register', {errors:false, success_msg:false});
});

router.get('/checkout',function(req,res){
	res.render('checkout');
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