var http =require("http"),
fs = require("fs");

http.createServer(function(req, res) {
	//se lee el archivo index.html, y se puede acceder a el, con el parametro html que se le pasa al callback
fs.readFile("./index.html", function(err,html){
	
	// convierte el archivo html en un string
	//antes de convertirlo, el archivo html esta codificado en binario, por eso se pasa a string para que sea legible como
	//un archivo html normal
	var html_string = html.toString();

	// el metodo match es un metodo de los strings que sirve para buscar una expresion dentro del string y devuelve el resultado
	//esa reguera de simbolos es para buscar el contenido que este entre llaves {}
	//cada elemento que consiga entre llaves, lo va guardando en una posicion como un arreglo
	var variables = html_string.match(/[^\{\}]+(?=\})/g)
	var nombre ="sadsadas";

	//como variables guarda un arreglo con los elementos entre llaves,
	//hay quee iterarlos en un ciclo para ir leyendo uno por uno, aunque en este caso solo haya uno
	for (var i = variables.length - 1; i >= 0; i--) {

		//la funcion eval, evalua el argumento que se le pasa como si fuera codigo de javascript, no como string ni nada
		var value = eval(variables[i]);

		//replace es un metodo que reemplaza el contenido del primero argumento, por el del segundo argumento
		//reemplaza lo que haya en la variable "variables" por lo que hay en "value"
		html_string = html_string.replace("{"+variables[i]+"}",value);
	}
		res.writeHead(200, {"Content-Type": "text/html"})
		res.write(html_string);
		res.end();
});
	}).listen(8080);


