var express= require("express");

var app = express();

//al colocar un motor de vistas, express busca por defecto las vistas en la carpeta views
app.set('view engine','pug');

app.get('/', function(req,res){
	//res.send('Hola mundo') envia la respuesta y cierra la respuesta para que el navegador no se quede cargando
	// no hace falta usar res.end
	//res.render recibe como primer parametro el nombre del archivo de la vista que va a renderizar
	//el segundo parametro son variables locales que se pueden usar en la vista
	res.render('index',{hola:"Hola Zoilo"});
})

app.listen(8080);