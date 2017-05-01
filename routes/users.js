	var express = require('express');
	var User = require('../models/user');
	var config = require('../config');
	var router = express.Router();
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;

	/* GET users listing. */
	router.get('/', function(req, res, next) {
	  res.render('index',{errors:false, title:'Pagina inicial de la Tienda'});
	});

	router.get('/register', function(req, res, next) {
	  res.render('register');
	});

	//Login
	router.get('/login', function(req,res){
		res.render('login');
	});

	 
	//Create User
	router.post('/signup',function(req,res){
		var name = req.body.name;
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		var password2 = req.body.password2;

		//Validation
		req.checkBody('username', 'El nombre de Usuario es necesario').notEmpty();
		req.checkBody('email', 'Email de Usuario es necesario').notEmpty();
		req.checkBody('email', 'El email no es valido').isEmail();
		req.checkBody('password', 'La contraseña es necesaria').notEmpty();
		req.checkBody('password2', 'Las contraseñas no coinciden').equals(req.body.password);

		var errors= req.validationErrors();
		if (errors) {
			res.render('register', {errors: errors});
		} else{
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
					console.log(user);
				}
			});
			req.flash('success_msg', 'Se ha registrado con Exito Ahora Puede Ingresar');
			res.redirect("/users/login");
		}

		
	});

	passport.use(new LocalStrategy(
		function(username,password,done){
			User.getUserByUsername(username, function(err, user){
				if(err) throw err;
				if(!user){
					return done(null, false, {message: 'Usuario desconocido'});
				}
				console.log(user.password);
				User.comparePassword(password, user.password, function(err, isMatch){
					if(err) throw err;
					if(isMatch){
						return done(null, user);
					}else {
						return done(null, false, {message: 'Contraseña incorrecta'});
					}
				});
			});

		}
	));

	passport.serializeUser(function(user,done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.getUserById(id, function(err, user){
			done(err,user);
		});
	});

	router.post('/login', 
		passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login', failureFlash:true}),
		function(req,res){
		res.redirect('/');
	});

	router.get('/logout', function(req,res){
		req.logout();

		req.flash('success_msg','Has salido del sistema');

		res.redirect('/users/login');
	});

module.exports = router;
