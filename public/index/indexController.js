angular.module('Index',['Factory'])
	.controller('mainCtrl',['$window','productService','categoryService','cartService',function($window,productService,categoryService,cartService){
		console.log('index controller created');
		var self=this;
		self.indexCount=0;
		self.productos=productService.full();
		self.categories=categoryService.full();
		self.addCart=function(product){
			cartService.add(product);
		}
		self.cart=cartService.merca();
		self.logOut=function(){
			cartService.clear();
		}
		self.remove=function(p){
			cartService.remove(p);
			$window.location.reload();
		}
	}])
	.factory('productService',['$http',function($http){
		var data=new Array();

		$http.get('/admin/allProducts').then(function(res){
			for (var i = 0; i < res.data.length; i++) {
				data.push(res.data[i]);
			}
		});

		return{
			full:function(){
				return data;
			}
		};
	}])
	.factory('categoryService',['$http',function($http){
		var data=new Array();
		$http.get('/admin/allCategories').then(function(res){
			for (var i = 0; i < res.data.length; i++) {
				data.push(res.data[i]);
			}
		});
		return{
			full:function(){
				return data;
			}
		};
	}])
