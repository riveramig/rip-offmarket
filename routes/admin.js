var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Product = require('../models/product');
var multer = require('multer');
var fs = require('fs');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,'uploads/');
	},
	filename: function(req,file,cb){
		cb(null,file.originalname);
	}
});

var upload = multer({storage:storage});

router.get('/',function(req,res,next){
	
      
	res.render('admin');
});

router.get('/dashboard',function(req,res,next){
	
      
	res.render('dashboard');
});

router.post('/createCategory',function(req,res){
	Category.findOne({name: req.body.nameCate},function(err, category){
		if(!category){
			var cat = new Category({
				name: req.body.nameCate
			});
			cat.save(function(err){
				if(err){
					console.log(err);
				}else{
					res.redirect("/admin");
				}
			});
		}else{
			res.json({message: 'Category already exists'});
		} 
	});
});

router.post('/createProduct',upload.single('avatar'), function(req,res){
	
	var produ=new Product({
		name: req.body.nameProdu,
		price: req.body.price,
		available: req.body.available,
		description: req.body.description,
		categories: req.body.categories
	});
	var imagex = fs.readFileSync('uploads/'+req.file.originalname);
	var buffer = new Buffer(imagex).toString('base64');
	//produ.image.data=fs.readFileSync('uploads/'+req.file.originalname);
	
	
    produ.image.data=buffer;
	produ.image.contentType=req.file.mimetype;

	produ.save(function(err){
		if(err){
			console.log(err)
		}else{
			res.redirect("/admin");
		}
	});

	
});

router.get('/allProducts',function(req,res){
	Product.find({},function(err,all){
		if(err){
			console.log(err);
		}else{
			res.json(all);
		}
	});
});

router.get('/allCategories',function(req,res){
	Category.find({},function(err,all){
		if(err){
			console.log(err);
		}else{
			res.json(all);
		}
	});
});

router.post('/removeProduct',function(req,res){
	Product.remove({name:req.body.data.removePro},function(err){
		if(err) console.log(err);
		res.redirect("/admin");
	});
});

router.post('/removeCategory',function(req,res){
	console.log(req.body);
	Category.remove({name:req.body.data.removeCa},function(err){
		if(err) console.log(err);
		res.redirect("/admin");
	});
});


////////////////////////////////// LOGIN ADMINSTRADOR ////////////////////////////////////
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

passport.serializeUser(function(user,done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.getUserById(id, function(err, user){
            done(err,user);
        });
    });

    router.post('/dashboard', 
        passport.authenticate('local',{successRedirect:'/admin',failureRedirect:'/dashboard', failureFlash:true}),
        function(req,res){
        res.redirect('/');
    });

    router.get('/logout', function(req,res){
        req.logout();

        req.flash('success_msg','Has salido del sistema');

        res.redirect('/admin/dashboard');
    });



    function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
    }







module.exports=router;