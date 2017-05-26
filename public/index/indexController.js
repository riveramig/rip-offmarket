angular.module('Index',['ngCookies'])
	.controller('mainCtrl',['productService','categoryService','cartService',function(productService,categoryService,cartService){
		console.log('index controller created');
		var self=this;
		self.index=4;
		self.productos=productService.full();
		self.categories=categoryService.full();
		self.addCart=function(p){
			cartService.add(p);
		};
		self.cart=cartService.merca();
		self.getTotal=function(){
			return cartService.getTotal();
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
	.factory('cartService',['$cookies',function($cookies){
		var cart=[];
		$cookies.put('MyCarroHomosexual',cart);
		return{
			add: function(data){
				console.log(data);
				console.log(cart);
				cart.push(data);
				$cookies.put('MyCarroHomosexual',cart);
			},
			merca: function(){
				var cookieGay=$cookies.get('MyCarroHomosexual');
				return cookieGay;
			},
			remove: function(p){
				var index=cart.indexOf(p);
				cart.splice(index,1);
			},
			getTotal: function(){
				var total=0;
				for(var a in cart){
					total=total+parseInt(cart[a].price);
				}
				return total;
			}
		};
	}])