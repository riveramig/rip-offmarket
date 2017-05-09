	var express = require('express');
	var User = require('../models/user');
	var config = require('../config');
	var router = express.Router();
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var FacebookStrategy = require('passport-facebook').Strategy;
	var configAuth = require('../config/auth');
	/* GET users listing. */
	

	router.get('/register', function(req, res, next) {
	  res.render('register',{errors:false});
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
			var user=new User();
				user.local.name=req.body.name;
				user.local.username= req.body.username;
				user.local.email= req.body.email;
				user.local.password= req.body.password;
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

				var us=(JSON.stringify(user));
				var use=JSON.parse(us);
				console.log(use);
				User.comparePassword(password, use.local.password, function(err, isMatch){
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


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ '_id	': profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database

                if (err)
                    return done(err);


                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();
                    console.log(profile);
                    // set all of the facebook information in our user model
                    newUser._id    = profile.id; // set the users facebook id                   
                    //newUser.token = token; // we will save the token that facebook provides to the user                    
                    newUser.name  = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.email; // facebook can return multiple emails so we'll take the first
                    newUser.username= profile.displayName;
                    var promise = newUser.save();
                    console.log(newUser);
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));


	// route for facebook authentication and login
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

     // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback', 
    	passport.authenticate('facebook', {failureRedirec: '/users/login'}), 
    	function(request, response){
  		response.redirect('/users');
	});

 	// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================

	passport.serializeUser(function(user,done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.getUserById(id, function(err, user){
			done(err,user);
		});
	});

	router.post('/login', 
		passport.authenticate('local',{successRedirect:'/users',failureRedirect:'/users/login', failureFlash:true}),
		function(req,res){
		res.redirect('/');
	});

	router.get('/logout', function(req,res){
		req.logout();

		req.flash('success_msg','Has salido del sistema');

		res.redirect('/users/login');
	});



    function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
	}

module.exports = router;
