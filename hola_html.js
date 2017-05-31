var http =require("http"),
//fs para cargar el modulo filesystem que entre otras cosas, sirve para leer y escribir archivos
fs = require("fs");

http.createServer(function(req, res) {
//sobre el responde "res" se pueden usar todos los metodos de node de http.serverresponse (leer docs de node)
//readFile recibe dos parametros, el primero es la direccion del archivo que va a leer de forma asincrona
// "./index.html" el . quiere decir que va a leer la direccion a partir de la ubicacion actual del archivo hola_html
//el segundo parametro es la funcion que se va a correr despues de leer el archivo
//err es donde se va guardar la informacion del error si no accede al archivo
//html es el contenido del archivo
fs.readFile("./index.html", function(err,html){
	//writehead escribe los headers de la respuesta
	//el primer parametro es el codigo http de la respuesta
	//se puede agregar un mensaje de status despues del codigo
	//esta es la sintaxis response.writeHead(statusCode[, statusMessage][, headers])
	//el segundo parametro es el tipo de contenido que lleva la respuesta
		res.writeHead(200, {"Content-Type": "application/json"})
		//write escribe en el body de la respuesta
		//escribe una parte de la respuesta, se puede usar varias veces
		res.write(JSON.stringify({nombre:"Zoilo", username:"zgranda"}));
		res.end();
});
	}).listen(8080);


