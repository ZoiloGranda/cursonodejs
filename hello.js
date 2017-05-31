//se requiere el modulo http que sirve para usar el protocolo http en el servidor
var http = require("http");
//la funcion manejador tiene dos parametros, uno para acceder a la solicitud y otro para escribir la respuesta
var manejador = function(solicitud,respuesta){
	//van a salir dos mensajes de recibimos una nueva peticion en la consola
	//una por la peticion de la pagina, y otra por la peticion del favicon
	console.log("Recibimos una nueva peticion");
	//end para terminar la respuesta, sino la pagina se queda cargando
	respuesta.end("Hola mundo");
};
//createServer crea una instancia de http.server, y la guarda como objeto en la variable servidor
//el parametro que se le pasa es un requestListener, o sea que escucha la peticion
var servidor= http.createServer(manejador);
//listen al puerto que se va a ejecutar el servidor
servidor.listen(8080);
