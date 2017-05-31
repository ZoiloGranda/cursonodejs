//con esto se conecta el cliente al servidor de websockets
var socket = io();

//cuando el cliente reciba un nuevo mensaje con nombre 'new image se ejecuta lal funcion'
//este es el nombre del mensaje que se pone en realtime.js, data es el mensaje que se recibe
socket.on('new image', function(data){
	data=JSON.parse(data)
	console.log(data);
	//el contenedor del template de handlebars
	var container = document.querySelector("#imagenes");
  //esto es para compilar un template de handlebars 
  //querySelector recibe como argumento un selector de css, por eso se usa el #, porque es el id del template
  //innerHTML para que seleccione todo el html que esta dentro del script, y no seleccione la etiqueta script del template
	var source = document.querySelector("#image-template").innerHTML;
  //para que handlebars compile el template
	var template= Handlebars.compile(source)
	//se le pasa al html interno del container, la data del template, que es la data de la nueva imagen subida
	//con este se muestra las nuevas imagenes subidas en tiempo real a la vista de /app
	//asi muestra la nueva imagen al final de la pagina
	//container.innerHTML+=template(data)
	//asi muestra la nueva imagen al principio de la pagina
	container.innerHTML=template(data)+container.innerHTML

});