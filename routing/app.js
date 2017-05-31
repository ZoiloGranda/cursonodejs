var express= require("express");

var app = express();

//al colocar un motor de vistas, express busca por defecto las vistas en la carpeta views
app.set('view engine','pug');

app.get('/', function(req,res){
	// no hace falta usar res.end
	//res.render recibe como primer parametro el nombre del archivo de la vista que va a renderizar
	//el segundo parametro son variables locales que se pueden usar en la vista
	res.render('index');
});

//asi se pasa un parametro o variable en el url, nombre puede ser cualquier cosa que se escriba en la url despues del /
app.get('/:nombre', function (req,res){
//asi se accede al parametro nombre de la url
	console.log(req.params.nombre)
	//el segundo parametro de render son variables que se le pasan a la vista
	res.render('form',{nombre:req.params.nombre});
});

app.post('/', function (req,res){
	res.render('form');
});

app.listen(8080);