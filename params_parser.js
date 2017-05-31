sudo apt-get install -y mongodb-org
function parse(req){
	var arreglo_parametros = [], parametros={};

	if (req.url.indexOf("?") > 0) {
		//split separa un string en cada parte donde haya el caracter que se le pasa como parametro "?", y lo devuelve como un arreglo
		// si la url es /?nombre=zoilo&data=algo, el arreglo quedaria asi ["/","nombre=zoilo&data=algo"]
		var url_data= req.url.split("?");
		//para separar cada parametro se toma el elemento del arreglo donde estan los parametros y se separan por &
		//quedaria asi ["nombre=zoilo","data=algo"]
		var arreglo_parametros = url_data[1].split("&");
	}

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
return parametros;
}

//exporta el objeto o funcion parse para que pueda ser accedida por otros archivos
module.exports.parse=parse;