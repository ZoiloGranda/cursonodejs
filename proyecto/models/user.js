var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

mongoose.connect('mongodb://localhost/fotos');

var posibles_valores=['M','F'];
//esa expesion regular es para evaluar que el string tiene forma de coreo
var email_match=[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Coloca un email valido']

var password_validation ={
	//el validator recibe como parametro el dato que se quiere guarda en la db
  //validator retorna false o true, si es true es que la validacion es correcta
  	validator:function(pass){
  		//this hace referencia al documento que se quiere guardar en la db
   		return this.password_confirmation==pass;
    	},
   	message:'Las contraseñas no son iguales'
    }

var user_schema= new Schema({
	name: String,
	lastName:String,
	//maxlenght maximo de caracteres que puede tener, y el mensaje de error si se pasa
	username: {
		type: String,
		required:true,
		maxlength:[50,'Nombre de usuario muy largo']},
	//
	password: {
		type:String,
		minlength:[8,'El password es muy corto'],
		///validate se usa para hacer una validacion personalizada
    validate: password_validation,},
	//min y max son validaciones para los tipos de dato number,colocan el valor minimo y maximo que se puede recibir
	//y el mensaje de error si no se cumple con la regla
	age: {
		type: Number,
		min: [5,'La edad no puede ser menor que 5'],
		max:[100, 'La edad no puede ser mayor de 100']},
	//required para establecer que obligatoriamente se tiene que recibir este dato
	//el mensaje se muestra si no se recibe un dato en email	
	//match es para compara un string con una expresion regular
	email: {
		type:String,
		required:'El correo es obligatorio',
		match:email_match},
	date_of_birth: Date,
	//enum es para establecer que solo se reciben esos valores
	sex:{
		type:String,
		enum:{values:posibles_valores,message:'Opcion no valida'}}
});

user_schema.virtual('password_confirmation').get(function(){
	return this.p_c
		//el valor que retorna el get lo recibe el set como parametro
}).set(function(password){
	this.p_c=password;
})

//mongoose automaticamente asigna el modelo a un coleccion del mismo nombre pero en plural
//el modelo User lo mapea a una coleccion Users
var User = mongoose.model('User',user_schema);
//se exporta el objeto User completo
module.exports.User=User;
