//recibe dos parametros para configurar el socket
module.exports = function(server, sessionMiddleware){
	//el server es una instancia del servidor http de node
	var io = require('socket.io')(server)
	var redis = require('redis');
	var client = redis.createClient();

  //susbcribe es para suscribir al cliente a un canal de publicaciones, 'images' es el nombre del canal
	client.subscribe('images')
	io.use(function(socket, next){
    sessionMiddleware(socket.request,socket.request.res,next)
	})

	//cada vez que se reciba un 'message', se ejecuta la funcion, que recibe como parametro el nombre del canal y el mensaje
	client.on('message',function(channel, message){
		//se coloca esta validacion porque un usuario puede estar suscrito a varios canales
    if(channel=='images'){
    	//emit envia el mensaje a todos los que esten suscritos
    	//el primer parametro es el nombre del mensaje, el segundo es el mensaje
    	io.emit('new image', message)
    }
	})

	//cuando se crea una conexion (se inicia sesion en la app), corre la funcion
	io.sockets.on('connection', function(socket){
		//la session actual se almacena en socket.request.session.user_id
		console.log('id del usuario actual en redis: '+socket.request.session.user_id)
		console.log();
	})

}