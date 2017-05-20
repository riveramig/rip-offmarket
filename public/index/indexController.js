angular.module('Index',[])
	.controller('mainCtrl',['productService','categoryService',function(productService,categoryService){
		console.log('index controller created');
		var self=this;
		self.index=4;
		self.productos=productService.full();
		self.categories=categoryService.full();
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