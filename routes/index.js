var express = require('express');
var router = express.Router();
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/products',function(req,res){
	Product.find({},function(err,products){
		if(err){
			console.log(err)
		}
		res.json(products);
	});
});

module.exports = router;
