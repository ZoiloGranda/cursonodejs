var http =require("http"),
fs = require("fs"),
parser=require("./params_parser.js");

//para almacenar directamente la funcion del archivo params_parser.js
var p = parser.parse;

//si se crea el servidor asi, con el callback, todas las rutas apuntan a lo mismo
http.createServer(function(req, res) {
	if(req.url.indexOf("/") > 0) {return;}

	console.log("nnnnnnnn\n\n\n\n");
	console.log(req);
	console.log("nnnnnnnn\n\n");

fs.readFile("./index.html", function(err,html){

	// convierte el codigo html en un string
	var html_string = html.toString();

	 //esa reguera de simbolos es para buscar el contenido que este entre llaves {}
	var variables = html_string.match(/[^\{\}]+(?=\})/g)
	var nombre ="";
	//llama a la funcion p y le pasa req como parametro
	var parametros=p(req);
	
	for (var i = variables.length - 1; i >= 0; i--) {
		//variable va a guardar el valor del elemento que se esté iterando
		var variable = variables[i];

		//reemplaza lo que haya en la variable "variables" por lo que hay en "value"
		html_string = html_string.replace("{"+variables[i]+"}",parametros[variable]);
	}
		res.writeHead(200, {"Content-Type": "text/html"})
		res.write(html_string);
		res.end();
});
	}).listen(8080);


