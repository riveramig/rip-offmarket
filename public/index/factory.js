angular.module('Factory',['LocalStorageModule'])
	.factory('cartService',['localStorageService',function(localStorageService){
		var cart=localStorageService.get('cart');
		if(cart==null){
			cart=[];
			localStorageService.set('cart',cart);
		}
		console.log(cart);
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
			}
		};
	}])