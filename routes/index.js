	var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next(); 
	}else{
		req.flash('error', 'No esta registrado Para acceder a esa ruta');
		res.redirect('/users/login');
	}

}

module.exports = router;
