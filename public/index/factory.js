angular.module('Factory',['LocalStorageModule'])
	.factory('cartService',['localStorageService','$http',function(localStorageService,$http){
		var cart=localStorageService.get('cart');
		if(cart==null){
			cart=[];
			$http.get('/users/getPurchases').then(function(res){
				if(res.data.products!=undefined){
					var temp=res.data.products;
					for(var i=0; i<temp.length; i++){
						var req={
							data:{
								id:temp[i]
							}
						};
						$http.post('/users/getPbyId',req).then(function(obj,status){
							cart.push(obj.data);
							console.log(cart);
						});
					}
				}
			});
			localStorageService.set('cart',cart);
		}
		return{
			add: function(data){
				console.log(data);
				console.log(cart);
				cart.push(data);
				localStorageService.set('cart',cart);
			},
			merca: function(){
				return localStorageService.get('cart');
			},
			remove: function(p){
				var temp=localStorageService.get('cart');
				for(var i=0; i<temp.length; i++){
					if(p._id==temp[i]._id){
						temp.splice(i,1);
					}
				}
				localStorageService.set('cart',temp);
			},
			getTotal: function(){
				var total=0;
				for(var a in cart){
					total=total+parseInt(cart[a].price);
				}
				return total;
			},
			clear: function(){
				localStorageService.clearAll();
			},
			save: function(){
				console.log(cart);
				var str=[];
				for(var i=0; i<cart.length; i++){
					str.push(cart[i]._id);
				}
				var req={
					data:{
						carrito:str
					}
				};
				$http.post('/users/purchase',req).then(function(data,status){
					console.log(data);
				});
			}
		};
	}])