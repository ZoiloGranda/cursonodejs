var User = require('../models/user').User

module.exports = function	(req,res,next){
	//si no hay nada en user_ide que es donde se guarda la id de la sesion actual, redirige al login para inciar sesión
	if(!req.session.user_id){
		res.redirect('/login')
	} else {
		//busca el usuario logeado en la base de datos
		User.findById(req.session.user_id, function(err, user){
      if (err) {
      	console.log(err)
   			res.redirect('/login')
      } else{
      	//res.locals es un objeto que contiene informacion disponible en cada peticion
      	//ahi se puede guardar la informacion del usuario logeado
      	res.locals={user:user};
  	    //next es para llamar al siguiente middleware
  	    //si está logeado sigue el flujo normal de la aplicacion
		    next();
      }
		})

	}
}