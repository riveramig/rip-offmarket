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
	res.json({message: 'Welcome to the admin page'});
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
					res.json({message :'Category '+req.body.nameCate+ ' has been created'});
				}
			});
		}else{
			res.json({message: 'Category already exists'});
		} 
	});
});

router.post('/createProduct',upload.single('avatar'), function(req,res){
	console.log(req.body);
	console.log(req.file);

	var produ=new Product({
		name: req.body.nameProdu,
		price: req.body.price,
		available: req.body.available,
		description: req.body.description
	});
	produ.image.data=fs.readFileSync('uploads/'+req.file.originalname);
	produ.image.contentType=req.file.mimetype;

	var arrays=req.body.categories;
	arrays.forEach(function(catego){
		Category.findOne({name: catego}, function (err, category){
			if(err){
				console.log(err);
			}
			console.log(category);
			produ.categories.push(category._id);
		});
	});

	produ.save(function(err){
		if(err){
			console.log(err)
		}else{
			res.json({message: 'Product created !'});
		}
	});
});

router.get('/allProducts',function(req,res){
	Product.find({},'name categories',function(err,all){
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
	Product.remove({name:req.body.removePro},function(err){
		if(err) console.log(err);
		res.json({message: 'product removed!'});
	});
});

router.post('/removeCategory',function(req,res){
	Category.remove({name:req.body.removeCa},function(err){
		if(err) console.log(err);
		res.json({message: 'category removed!'});
	});
});

module.exports=router;