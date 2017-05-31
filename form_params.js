var http =require("http"),
fs = require("fs");

//si se crea el servidor asi, con el callback, todas las rutas apuntan a lo mismo
http.createServer(function(req, res) {
	if(req.url.indexOf("/") > 0) {return;}

	console.log("nnnnnnnn\n\n\n\n");
	console.log(req);
	console.log("nnnnnnnn\n\n");


fs.readFile("./index.html", function(err,html){

	// convierte el codigo html en un string
	var html_string = html.toString();
	///con parametro={} , se crea el hash del arreglo
	var arreglo_parametros = [], parametros={};

	 //esa reguera de simbolos es para buscar el contenido que este entre llaves {}
	var variables = html_string.match(/[^\{\}]+(?=\})/g)
	var nombre ="";

	//se a iterando el arreglo de parametros para ir leyendo cada dupla de atributo y valor
	for (var i = arreglo_parametros.length - 1; i >= 0; i--) {
		var parametro=arreglo_parametros[i];
		//con el = va separar cada uno de los elemento que hay en el arreglo
		//quedaria asi ["nombre","zoilo","data","algo"]
		var param_data=parametro.split("=");
		//como es un hash, va a guardar lo que hay en param_data[0] como parametro, y param_data[1] como valor
		//queda asi {"nombre":"zoilo"}
		parametros[param_data[0]]=param_data[1];

	}

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


