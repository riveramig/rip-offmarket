var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Product = require('../models/product');
var multer = require('multer');
var fs = require('fs');


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

module.exports=router;