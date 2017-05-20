    var express = require('express');
    var User = require('../models/user');
    var config = require('../config');
    var router = express.Router();
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var TwitterStrategy  = require('passport-twitter').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var configAuth = require('../config/auth');
    var Purchase = require('../models/purchase');
    /* GET users listing. */
    

    router.get('/register', function(req, res, next) {
      res.render('register',{errors:false});
    });

    //Login
    router.get('/login', function(req,res){
        res.render('register',{errors:false, success_msg:false});
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
            res.redirect("/login");
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
            User.findOne({'facebook.id': profile.id}, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database

                if (err)
                    return done(err);


                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                   
                    var newUser            = new User();
                    console.log(profile);
                    newUser.local.username = profile.id;
                    newUser.local.email = profile.id;
                    newUser.local.password = profile.id;
                    newUser.facebook.id    = profile.id;                 
                    newUser.facebook.token = token; 
                    newUser.facebook.name  = profile.displayName; 
                    newUser.facebook.email = profile.id;
                    
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
        passport.authenticate('facebook', {failureRedirec: '/login'}), 
        function(request, response){
        response.redirect('/users');
    });

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================



    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function(token, tokenSecret, profile, done) {
        console.log("Entrooooooooooooooo");
        // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser                 = new User();

                    newUser.local.username = profile.id;
                    newUser.local.email = profile.id;
                    newUser.local.password = profile.id;

                    // set all of the user data that we need
                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });

        });

    }));

    router.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    router.get('/auth/twitter/callback',
        passport.authenticate('twitter', {failureRedirect : '/login'}),
        function(request, response){
        response.redirect('/users');
    });

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================


     // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    newUser.local.username = profile.id;
                    newUser.local.email = profile.id;
                    newUser.local.password = profile.id;

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });

        });

    }));
    router.get('/auth/google', passport.authenticate('google',{scope : ['profile', 'email'] }));

    // handle the callback after twitter has authenticated the user
    router.get('/auth/google/callback',
        passport.authenticate('google', {failureRedirect : '/login'}),
        function(request, response){
        response.redirect('/users');
    });
    // =========================================================================
    // GOOGLE ==================================================================
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
        passport.authenticate('local',{successRedirect:'/users',failureRedirect:'/login', failureFlash:true}),
        function(req,res){
        res.redirect('/');
    });

    router.get('/logout', function(req,res){
        req.logout();

        req.flash('success_msg','Has salido del sistema');

        res.redirect('/login');
    });



    function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
    }



    /////////   ////////////////////////////

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

router.post('/purchase',function(req,res){
    owner=res.user;
    
    var products = req.body.products;
    var date =new Date();
    var price = 0;
    products.forEach(function(pro){
        price=price+pro.price;
    });

    var purchase = new Purchase({
        date : date,
        products : products,
        price : price,
        owner :  owner
    });

    purchase.save(function(err){
        if(err) console.log(err);
        res.json({message: 'Purchase confirmed'});
    });
});

module.exports = router;