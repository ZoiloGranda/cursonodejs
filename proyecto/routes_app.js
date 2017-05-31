var express = require('express');
//Router es el objeto de express para manejar rutas
var router= express.Router();
var image_finder_middleware= require('./middlewares/find_image')
var Imagen = require('./models/imagenes')
var fs= require('fs');
var redis = require('redis');

//se crea un cliente de redis, con la configuraciones por defecto
var client = redis.createClient()
//el root de todas estas rutas es /app, asi se define en app.js cuando se usa el app.use('/app',router_app);
router.get('/',function (req,res){
  Imagen.find({})
  .populate('creator')
  .exec(function(err, imagenes){
    if(err) console.log(err);
    res.render('app/home',{imagenes:imagenes})
  })
})

router.get('/imagenes/new',function(req,res){
	res.render('app/imagenes/new')
})
//el asterisco quiere decir, cualquier string, hasta puede ser otra ruta despues del :id
//esto va a llamar al middleware image_finder_middleware en todo las peticion de cualquier metodo(put, get, post, etc)
// a las rutas que coincidan con '/imagenes/:id*'
router.all('/imagenes/:id*', image_finder_middleware)

router.get('/imagenes/:id/edit',function(req,res){
  //{imagen:imagen} para pasarle la variable imagen a la vista
  //esto se dejó de usar porque al guardar la imagen en res.locals, puede ser accedida por la vista tambien
  //la funcion que la guarda en locals es el middleware de find_image
  //res.render('app/imagenes/edit',{imagen:imagen}) 
  res.render('app/imagenes/edit') 
})

//asi se definen varios metodos para una misma ruta
router.route('/imagenes/:id')
  .get(function(req,res){
    res.render('app/imagenes/show')	
  })
  .put(function(req,res){
    Imagen.findOne({ _id: req.params.id }, function (err, doc){
      doc.title = req.fields.title;
      doc.save();
      if(!err){
        console.log(err);
        res.render('app/imagenes/show') 
      } else {
        res.redirect('/app/imagenes/'+req.params.id) 
      }
    })
  })

  .delete(function(req,res){
    Imagen.findOneAndRemove({_id:req.params.id},function(err,doc){
      if(!err){
        res.redirect('/app/imagenes')
      } else {
        res.redirect('/app/imagenes'+req.params.id)
      }
    })
  });

router.route('/imagenes')
  .get(function(req,res){
    //con esa condicion en el find, la consulta solo se trae las imagenes que esten creadas por el usuario que este logeado
  	Imagen.find({creator:res.locals.user._id},function(err,imagenes){
  		if (err) {res.redirect('/app');
  		  return
  	  }
      res.render('app/imagenes/index',{imagenes:imagenes})

  	})

  })
  .post(function(req,res){
    //para guardar la extension del archivo, se lee desde el nombre que tenia la imagen cuando se guardó (imagen.nueva.jpg)
    //con split se separa donde haya '.' , y devuelve un arreglo con cada string (['imagen','nueva','jpg'])
    //con pop se selecciona el ultimo elemento del arreglo(['jpg'])
    var extension = req.files.archivo.name.split('.').pop()
  	var data = {
  		//el title viene del title del formulario
      //la informacion del usuario está ahi, porque el middleware de session.js lo guardó ahi
  		title:req.fields.title,
      creator:res.locals.user,
      extension:extension
  	}
  	//se instancia el modelo con los valores de data, que se correponden con el schema que se declaro en el modelo Imagen
  	var imagen = new Imagen(data)
  	imagen.save(function(err){
  		//si no hay error, redireccione a la ruta de la imagen creada
      if (!err) {
        var imgJSON ={
          id:imagen._id,
          title:imagen.title,
          extension:imagen.extension
        }
        //con publish se publica un mensaje en el canal 'images' a los demas clientes
        //el segundo parametro es el mensaje que se esta enviando
        //se va a publicar un mensaje cada vez que se suba una imagen
        client.publish('images',JSON.stringify(imgJSON))
        //rename mueve un archivo  y le cambia el nombre
        //el primer parametro es la ubicacion actual, el segundo la ubicacion donde se va a mover con el nuevo nombre
        fs.rename(req.files.archivo.path,'public/imagenes/'+imagen._id+'.'+extension);
      	res.redirect('/app/imagenes/'+imagen._id)
      } else {
      	res.render(err)
      }
  	})

  });

module.exports=router;