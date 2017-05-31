var Imagen= require('../models/imagenes')
var owner_check = require('./image_permission')

module.exports= function(req, res, next){
  Imagen.findById(req.params.id)
  	//populate llena la referencia de un documento, con la informacion del documento
  	//o sea se trae la informacion de creator, que esta en otra coleccion y la coloca en el camppo creator de imagen
  	.populate('creator')
  	.exec(function (err, imagen){
  		//si la imagen existe y si owner_check es true, entra en el if
	  	if(imagen!=null&& owner_check(imagen,req,res)){
	  		//se guarda en locals para que los demas middlewares tengan acceso a la imagen
	  		res.locals.imagen = imagen
	  		next()
	  	} else {
	  		res.redirect('/app')
	  	}
	})
}