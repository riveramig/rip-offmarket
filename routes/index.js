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
		console.log(req.user);
		
	  res.render('index', { title: 'Tienda Autenticada el Usuarios es:', User: usuario, user_id: req.user._id });
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
		
	  res.render('cart', { title: 'Tienda Autenticada el Usuarios es:', User: usuario, user_id: req.user._id });
	});

	router.get('/login',function(req,res){
		res.render('register', {errors:false, success_msg:false});
	});

	router.get('/checkout',function(req,res){
		var usuario=undefined;
		if(req.user!= undefined){
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
		}
		
		
	  res.render('checkout', { title: 'Tienda Autenticada el Usuarios es:', User: usuario, user_id: req.user._id });
	});

	router.get('/admin', ensureAuthenticatedAdmin,function(req, res, next) {
		res.render('admin',{User: req.user.local.name, user_id: req.user._id});
	});


	function ensureAuthenticated(req, res, next){
		if(req.isAuthenticated()){
			return next(); 
		}else{
			req.flash('error', 'No esta registrado Para acceder a esa ruta');
			res.redirect('/users/login');
		}

	}


	function ensureAuthenticatedAdmin(req, res, next){
		if(req.user!= undefined){
			if (req.user.local.username=="Administrador") {

			if(req.isAuthenticated()){
				return next(); 
			}else{
				req.flash('error', 'No esta registrado Para acceder a esa ruta');
				res.redirect('/admin/dashboard');
			}

		}else{
			req.flash('error', 'No esta registrado Para acceder a esa ruta');
			res.redirect('/admin/dashboard');
			}
		}else{
			req.flash('error', 'No esta registrado Para acceder a esa ruta');
			res.redirect('/admin/dashboard');
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