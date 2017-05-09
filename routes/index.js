var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: 'Tienda sin autenticar', User:{name: ""}});
});

router.get('/users', ensureAuthenticated,function(req, res, next) {
  res.render('index', { title: 'Tienda Autenticada el Usuarios es:', User: req.user });
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
