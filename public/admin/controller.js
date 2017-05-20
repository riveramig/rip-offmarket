angular.module('Admin',[])
	.controller('mainCtrl',['productService','categoryService','$http',function(productService,categoryService,$http){
		var self =this;
		self.productos=productService.full();
		self.categories=categoryService.full();
		self.mostrar=true;
		self.crearProdu=false;
		self.categoria=false;
		console.log('Controlador creado beatch');
		self.mostrarTodo=function(){
			self.mostrar=true;
			self.crearProdu=false;
			self.categoria=false;


		}
		self.crearProducto=function(){
			self.mostrar=false;
			self.categoria=false;
			self.crearProdu=true;
		}
		self.crearCategoria=function(){
			self.mostrar=false;
			self.crearProdu=false;
			self.categoria=true;
		}
		self.deleteProduct=function(producto){
			console.log(producto);
			var req={
				data:{removePro: producto.name}
			}; 
			$http.post("/admin/removeProduct",req).then(function(data,status){
				console.log("El dato "+data+" Se elimino");
			});
		}
		self.deleteCategory=function(category){
			console.log(category.name);
			var req={
				data:{removeCa: category.name}
			};
			$http.post("/admin/removeCategory",req).then(function(data,status){
				console.log("El dato "+data+" Se elimino");
			});
		}
	}])
	.factory('productService',['$http',function($http){
		var data=new Array();

		$http.get('/admin/allProducts').then(function(res){
			for (var i = 0; i < res.data.length; i++) {
				data.push(res.data[i]);
				console.log(res.data[i]);
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
