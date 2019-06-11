/**
 *
 * UTILS FILE
 * description: Provides a set of functions to use in this project as needed
 * author: @thiagoenge
 * ---------------------
 * SUMMARY:
 * - Helpers
 * - Validation
 * - Normalize (masks)
 *
 */

/*===============================
=            HELPERS            =
===============================*/
/**
 * fn onlyNumbers 	- retirar tudo que não é digito da string respeitando sinal de negativo, se houver.
 * @param value 	- {string}  valor para exlcuir letras e simbolos
 * @return 			- {string}	numeros retirados da string
 */
var onlyNumbers = function(value, neg){
	neg = !!neg;
	value = neg ? "-" : "" + (value.replace(/(^-{1})|(\d)|(\D)/g,"$1$2"));
	return value;
}
/**
 * fn formatDateInternational 	- fortmata data no padrao AAAA/MM/DD
 * @param  value 				- {string} data no formato MM/DD/AAAA
 * @return 						- {string} data formatada
 */
var formatDateInternational = function(value){
  var arrDate = value.split("/");
  if(!arrDate.length){
    return false;
  }
  var year = "20"+arrDate.pop();
  var month = arrDate.pop();
  var day = arrDate.length ? arrDate[0] : "01"
  var dateFormated = year+"/"+month+"/"+day
  return dateFormated
}
/**
 * isEmptyObject
 *  Verifica se o objeto possui propriedades, para evitar erros com o react create child
 * `hasOwnProperty` é necessário caso seja adicionado alguma
 * 	propriedade via prototype
 *  ex: Object.prototype.algumaProp = "oi"
 *  const novoObjeto = {}
 *  O objeto continua vazio, mas possui propriedade herdada, hasOwnPropierty resolve isso!
 *
 * @param  {object}  obj objeto a ser verificado
 * @return {Boolean} diz se o objeto passado é vazio ou não
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var isEmptyObject = function(obj){
    // null, undefined e false é "empty"
    if (obj == null || obj == undefined || obj == false ) return true;
    // Objeto tem todas as sua propriedades?
    // toString e valueOf são erros de enumeração no IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}
/**
 * MESSAGES_TO_USER
 *  strings para erros específicos
 * @type {Object}
 */
var MESSAGES_TO_USER = {
	creditcard: "Número de cartão inválido.",
	expiration: "Data de expiração inválida.",
	cpf:"Este número de CPF não é válido."
}
/**
 * messageValidation
 * 	recebe o método e retorna a string
 *  correspondente ao campo que falhou
 * @param  {string} validatorMethod deve ser uma das properties name do objeto MESSAGES_TO_USER
 * @return {string} mensagem que irá para o objeto de retorno da validacao e poderá ser usado para informar ao usuario
 */
var messageValidation = function(validatorMethod){
	validatorMethod = validatorMethod || null
	if(!validatorMethod) return;
	return MESSAGES_TO_USER[validatorMethod.toLowerCase()] || "Campo inválido";
}
/**
 * validationFields
 * 	recebe um objeto com os valores e os metodos pelos quais esses valores serão validados
 * @param  {object} _object deve conter a seguinte estrutura:
 * {
 * [html name do input]:
 * 		{
 * 		value: {string}  valor do campo
 * 		validationRules: {array} [nomes dos metodos de validacao pelo qual o valor vai passar]
 * 		isRequired: {boolean} verifica se o campo é obrigatório
 * 	 	}
 * }
 * @return {object} objeto contendo o status da validacao, o nome do campo com erro e a mensagem do erro, na seguinte estrutura:
 *  {
 *    status: {string},
 *    fieldName: {string} || null (apenas se der erro)
 *    msg: {string} (apenas se der erro)
 *  }
 */
var validationFields = function(_object){
	if(isEmptyObject(_object)) return {status:"error", fieldName: null, msg:"nenhum campo para validar"}

	var validator = ValidateData()

	//to keep readable for old browsers
	for (var prop in _object){
		var _field = _object[prop]
		if(_field.required && !_field.value){
			return {status:"error", fieldName:prop, msg:"Campo Obrigátorio"}
		}
		if(_field.validationRules && _field.validationRules.length){
			validator.setData(_field.value)
			/**
				TODO:
				- Array map on validationRules
			 */
			var isValid = validator[_field.validationRules[0]]()
			if(!isValid) return {status:"error",fieldName:prop, msg:messageValidation(_field.validationRules[0])}
		}
	}
	//if all ok so do
	return {status: "success"}
}
/*=====  End of HELPERS  ======*/

/*===============================
=    EXTENDS NATIVE METHODS     =
===============================*/
String.prototype.toCamelCase = function() {
    return this.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
}
String.prototype.toSlug = function(){
	str = this;
	str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
    //Reference: https://gist.github.com/codeguy/6684588
}

/*========================================
=            VALIDATION CLASS            =
========================================*/
var ValidateData = function(){
return({
	//GETTER AND SETTER
	_data: '',
	getData: function(){
		return this._data;
	},
	setData: function(input){
		this._data = input
	},
	//METHODS
	CPF: function(){
		this.setData(onlyNumbers(this._data, false))
		return this._cpfRule()
	},
	CREDITCARD: function(){
		this.setData(onlyNumbers(this._data, false))
		return this._credidCardRule()
	},
	GETBRAND: function(){
		this.setData(onlyNumbers(this._data, false))
		return this._brandCardRule();
	},
	EXPIRATION: function(){
		this.setData(formatDateInternational(this._data))
		return this._expirationRule()
	},
	MONTH: function(){
		this.setData(this.getData())
		return this._monthRule()
	},
	DATEVALID: function(){
		this.set = this.getData
		return this._dateValidRule();
	},
	//RULES VALIDATION
	_cpfRule: function(){
		var cpf = this.getData()
		//Retorna se tamanho for diferente de 11
	    if (cpf.length != 11) return false;
	    // Valida Digitos Verificadores
	    // Peso CPF (10 9 8 7 6 5 4 3 2)
	    // PRIMEIRO DIGITO
	    var add = 0;
	    for (var i=0; i < 9; i ++)
	        add += parseInt(cpf.charAt(i)) * (10 - i);
	        var rev = 11 - (add % 11);
	        if (rev == 10 || rev == 11)
	            rev = 0;
	        if (rev != parseInt(cpf.charAt(9)))
	            return false;
	    // SEGUNDO DIGITO
	    add = 0;
	    for (var i = 0; i < 10; i ++)
	        add += parseInt(cpf.charAt(i)) * (11 - i);
	    rev = 11 - (add % 11);
	    if (rev == 10 || rev == 11)
	        rev = 0;
	    if (rev != parseInt(cpf.charAt(10)))
	        return false;
	    return true;
	},
	_credidCardRule: function(){
		if(this.getData().length < 13){
 			return false;
		}
		return true
	},
	_brandCardRule: function(){
		var brand = "";
		//Visa
		var re = /^4/;
		if (this.getData().match(re) != null)
			brand = "Visa";
		// Mastercard
		if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(this._data))
			brand = "MasterCard";
		// Diners
		re = /^3(?:0[0-5]|[68][0-96011437910711850])/;
		if (this.getData().match(re) != null)
			brand = "Diners";
		// AMEX
		re = /^3[47]/;
		if (this.getData().match(re) != null)
			brand = "American Express";
		// Elo
		re = /^401178|^401179|^431274|^438935|^451416|^457393|^457631|^457632|^504175|^627780|^636297|^636368|^(506699|5067[0-6]\d|50677[0-8])|^(50900\d|5090[1-9]\d|509[1-9]\d{2})|^65003[1-3]|^(65003[5-9]|65004\d|65005[0-1])|^(65040[5-9]|6504[1-3]\d)|^(65048[5-9]|65049\d|6505[0-2]\d|65053     [0-8])|^(65054[1-9]|6505[5-8]\d|65059[0-8])|^(65070\d|65071[0-8])|^65072[0-7]|^(65090[1-9]|65091\d|650920)|^(65165[2-9]|6516[6-7]\d)|^(65500\d|65501\d)|^(65502[1-9]|6550[3-4]\d|65505[0-8])/
		if (this.getData().match(re) != null)
			brand = "Elo"
		// // Discover
		re = /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/;
		if (this.getData().match(re) != null)
			brand = "Discover";
		// Hipercard
		re = /^3841[046]0|^606282/
		if (this.getData().match(re) != null)
			brand = "Hipercard";
		//Hiper
		re = /^637095|^637612|^637599|^637609|^637568/;
		if (this.getData().match(re) != null)
			brand = "Hiper"

		return brand;
	},
	_monthRule: function(){
	    var getMonthInputed = 0;
	    var dateInputed = this.getData();
	    if(dateInputed.length <= 7){
	      getMonthInputed = dateInputed.split("/")[0]
	    }else{
	      getMonthInputed = dateInputed.split("/")[1]
	    }

		return getMonthInputed >= 1 && getMonthInputed <= 12
	},
	_expirationRule: function(){
		var dateInputed = this.getData();
		if(!dateInputed)
	  		return false

	    var dateInputedFormated = new Date(dateInputed);
	    var today = new Date();
	    var yearInputed = dateInputedFormated.getFullYear();
	    var monthInputed = dateInputedFormated.getMonth();
	    var lastDayOfMonthOfDateInputed = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
	    var yearCurrent = today.getFullYear();
	    var monthCurrent = today.getMonth();
	    var dayCurrent = today.getDay();

	    if(yearInputed > yearCurrent){
	      return true
	    }else if(yearInputed == yearCurrent){
	      if(dateInputedFormated.getMonth() > today.getMonth()){
	        return true
	      }else if(monthInputed == monthCurrent){
	        if(lastDayOfMonthOfDateInputed >= dayCurrent){
	          return true
	        }
	      }
	    }
	    return false
	},
	_dateValidRule: function(){
		var dateInputed = this.getData()
		var day = dateInputed.substring(0,2);
		var month = dateInputed.substring(3,5);
		var year = dateInputed.substring(6,10);
		//Criando uma data com as infos recebidas
		var newDate = new Date(year,(month-1),day);
		//Atribuicao condicional para saber se a data passada é
		//igual a data criada na instrução acima
		var checkDay = parseInt(day, 10) == parseInt(newDate.getDate());
		var checkMonth = parseInt(month, 10) == parseInt(newDate.getMonth()+1);
		var checkYear = parseInt(year) == parseInt(newDate.getFullYear());
		//Verifica as var de checagem e retorna true caso todas sejam verdadeiras ou false caso alguma falhe
		return checkDay && checkMonth && checkYear
	}
})}

/*=======================================
=            NORMALIZE CLASS            =
=======================================*/
var NormalizeData = function(){
return({
	//GETTER AND SETTER
	_data: '',
	dataMasked: function(){
		return this._data;
	},
	newData: function(newData){
		this._data = newData
	},
	//METHODS
	CREDITCARD: function(){
		this.newData = onlyNumbers(this._data);
	    if(this.dataMasked().length >= 16)
	      this.newData = this.dataMasked().slice(0,16)
	    this._creditCardNumberRule()
	    return this.dataMasked();
	},
	CPF: function(){
		this.newData = onlyNumbers(this._data);
		//Não deixa entrar mais do que 11 dígitos
		if(this.dataMasked().length >= 11)
			this.newData = this.dataMasked().slice(0,11)
		this._cpfMaskRule()
		return this.dataMasked();
	},
	CNPJ: function(){
		this.newData = onlyNumbers(this._data);
		//Não deixa entrar mais do que 14 dígitos
		if(this.dataMasked().length >= 14)
			this.newData = this.dataMasked().slice(0,14);
		this._cnpjMaskRule();
		return this.dataMasked();
	},
	DATEFORMAT: function(){
		this.newData = onlyNumbers(this._data);
		//Não deixa entrar mais do que 8 dígitos
		if(this.dataMasked().length >= 8)
		  this.newData = this.dataMasked().slice(0,8);
		this._dateFormatRule();
		return this.dataMasked();
	},
		//RULES NORMALIZATION
		_creditCardNumberRule: function(){
		    var cc = this.dataMasked();
		    cc = cc.replace(/(\d{4})/g, "$1 "); // Coloca um espaco a cada 4 caracteres
		    cc = cc.replace(/\s$/, ""); // Remove o espaco se estiver sobrando
		    this.newData = cc;
	},
	_cpfMaskRule: function(){
	    if(isNaN(this._data)){
	      console.warn('NormalizeData.CPF() precisa ser um número')
	      return false
	    }
	    var cpf = this.dataMasked();

	    //Adiciona um ponto entre o terceiro e o quarto dígito
	    cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2")
	    //Adiciona um ponto entre o sexto e o setimo dígito
	    cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
	    //Adiciona um traço entre o nono e o decimo dígito
	    cpf = cpf.replace(/(\.\d{3})(\d{2})$/, "$1-$2")
	    //return ###.####.###-##
	    this.newData = cpf;
	},
	_cnpjMaskRule: function(){
	    if(isNaN(this._data)){
	      console.warn('Normalize.CNPJ() precisa ser um número')
	      return false
	    }
	    var cnpj = this.dataMasked();
	    //Adiciona formataçao para 12 digitos ja inputados
	    cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4")
	    //Adiciona um ponto entre o quinto e o sexto dígito
	    cnpj = cnpj.replace(/(\/\d{4})(\d{2})$/, "$1-$2")
	    //return ##.###.###/####-##
	    this.newData = cnpj;
	 },
	 _dateFormatRule: function(){
	   if(isNaN(this._data)){
	     console.warn('NormalizeData.PHONE() precisa ser um número')
	     return false
	   }
	   var dateMasked = this.dataMasked();
	   //Adiciona "/" depois dos 2 primeiros digitos"
	   dateMasked = dateMasked.replace(/^(\d{2})(\d)/g,'$1/$2');
	   //Adiciona o separador "-" entre os digitos tanto em telefones com 9 ou 8 dígitos
	   dateMasked = dateMasked.replace(/(\d)(\d{4})$/,'$1/$2');
	   //Retorna a máscara
	   this.newData = dateMasked;
	 },
})}
