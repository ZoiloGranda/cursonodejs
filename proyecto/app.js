var express= require('express');
var bodyParser=require('body-parser');
var User = require('./models/user').User
//express-session es un middleware para manejar sesiones
//lo dejamos de usar porque las sesiones se guardan en la memoria y al reiniciar el servidor se perdía la sesión
///y despues lo empezamos a usar de nuevo porque es el que funciona con redis
var session = require('express-session');
//con cookie session, se guarda la informacion de la sesion en el cliente
//se dejó de usa cookie session para usar express sesion de nuevo
//var cookieSession= require('cookie-session');
var router_app =require('./routes_app')
var session_middleware = require('./middlewares/session');
var methodOverride =require('method-override');
//formidable es para hacer parse de distintos tipo de formularios, aqui lo usamos para manejar la imagen que se subió
var formidable = require('express-formidable');
//a conect redis se le pasa la variable que hace require de express sesion
var RedisStore = require("connect-redis")(session);
//la iterfaz de http de node
var http = require('http');
//realtime es el archivo donde se configura socket.io
//tambien hay que cargar un archivo en el html, en layout.pug, y otro en home.pug
var realtime = require('./realtime');
var app = express();
//se instancia el servidor http
var server = http.Server(app);

//esto es para la configuracion de la session entre express session y connect redis
var sessionMiddleware = session({
  //se deja las configuraciones vacias porque se estan usando los valores por defecto
  store: new RedisStore({}),
  secret: 'secretword'
});
//se le pasa el server http, y el sessionMidleware para compartir la sesion entre express y socket.io
realtime(server,sessionMiddleware);
//middleware para cargar archivos estaticos
//la direccion de la carpeta es desde el directorio donde se carga el app.js
//el primer parametro es una ruta virtual para acceder a los archivos estaticos
//esa ruta virtual se usa para evitar conflictos con las rutas de la aplicacion
app.use('/public',express.static('public'))
//al colocar un motor de vistas, express busca por defecto las vistas en la carpeta views
//el bodyparser expone el contenido de la peticion en el objeto body de la peticion que recibe el servidor
app.use(bodyParser.json())
//con extended true se puede hacer parse a parametros, arreglos y otras cosas de la url
app.use(bodyParser.urlencoded({extended:true}))

app.use(methodOverride('_method'))

app.use(sessionMiddleware);

//formidable renombra y mueve todos los archivos subidos a otra carpeta, con keepextensions, se le dice
//que mantenga en el nombre las extensiones de los archivos
app.use(formidable({
  keepExtensions:true,
}));

app.set('view engine','pug');

app.get('/', function(req,res){
  console.log('esto es en /')
  console.log(req.session.user_id);
  res.render('index')
});

app.get('/signup', function (req,res){
  //find ejecuta una consulta a la coleccion User, buscando todos los documentos
  //como no tiene condiciones, se va a traer todos los documentos, y los guarda en la variable doc
  User.find(function(err,doc){
    res.render('signup');  
  })
});


app.get('/login', function (req,res){
  res.render('login');  
});
app.post('/users',function (req,res){
  //se instancia un objeto o documento usando el schema user_schema que esta en el modelo User
  var user = new User({
    //se guarda el nuevo usuario con los valores que viene del formulario
    email:req.fields.email,
    password:req.fields.password,
    password_confirmation:req.fields.password_confirmation,
    username: req.fields.username
  })

  user.save().then(function(data){
    res.send('El usuario fue agregado exitosamente');
  },function(err){
    console.log(String(err));
    res.send('Ocurrió un error al guardar')
  })
})

app.post('/sessions',function (req,res){
  //findOne ejecuta una consulta a la db, con el email y el password que se colocaron en el login,
  //y retorna un solo documento que coincida
  //el segundo paramentro es para que solo retorne los campos email y password del documento
  User.findOne({email:req.fields.email,password:req.fields.password},'email password',function (err, docs){
    //la session se encuentra disponible en el req,en el objeto session
    req.session.user_id=docs._id;
    res.redirect('/app');

  })
});
//cuando esté en la ruta /app, va a llamar al session_middleware para comprobar si el usuario inció sesion
app.use('/app',session_middleware)
//al usar router_app se usan las rutas definidas en su archivo routes_app.js
//el primer parametro que recibe es la ruta principal o root de toda la aplicacion
//esta ruta /app se va a aplicar a todas las rutas que estan en route_app.js
app.use('/app',router_app);
//se usa server.listen en vez de app.listen porque se puede reusar el servidor para correr socket.io en la misma instancia
//tambien se puede usar app.listen pero de otra formaa
server.listen(8080);