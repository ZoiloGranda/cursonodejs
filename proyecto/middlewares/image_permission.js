var Imagen = require('../models/imagenes');

module.exports = function(image,req,res){
///en caso de que la imagen no tenga creador
	if (typeof image.creator =='undefined') {
		return false
	}
	// True = Tienes permisos
	// Falso = si no tienes permisos
	//valida que el metodo sea get y que el path sea para edit
  //esto es porque todos los usuarios pueden ver la imagenes, pero solamente el creador la puede editar
  if(req.method === 'GET' && req.path.indexOf('edit' ) < 0){
  	console.log('req.path '+req.path)
    // Ver la imagen
    return true;
  }
  if(typeof image.creator == 'undefined'){
   return false;
  }
  //si la id del creador de la imagen es la misma que la id del usuario logeado, entonces la puede editar
  if(image.creator._id.toString() == res.locals.user._id) { 
    return true;
  }
  return false;
 }