/**
 *
 * Metódos para interagir com o widget de atendimento
 *
 * atributo inicializador dos métodos: DATA-ATTENDANT
 * valor do atributo data: NOME DO MÉTODO
 * OBS: o nome do método deve estar presente na lista de métodos abaixo.
 * OBS2: passar o nome do método sem underline e separados por hifen ex.:
   (...)<li data-attendant='new-attendance'>(...)
 *
 */

// Utiliza o objeto global já existente ou define um objeto global com o nome do projeto
var cws = cws || {
	attendantService: {}
};
cws.attendantService = (function (){
	//HOSTING ESCOPE
	var self = cws.attendantService;
	/**
	 * function _getCwsAttendant
	 * Vai buscar e devolve o objeto global do widget-attendant
	 * @return {obj} objeto widget-attendant
	 */
	var _getCwsAttendant = function(){
		return window.cwsAttendant
	};
	/**
	 * function _dataInit
	 * Responsável por inicializar o método
	 * setado via data-attribute no DOM
	 * @param  {obj} ev objeto de evento de quem chamou a funcao
	 * @return {funcao}  Dispara o método passado
	 */
	var _dataInit = function(ev){
		var $this = $(ev.currentTarget);
		var action = $this.data("attendant");
		return _init(action, $this[0]);
	}
	/**
	 * function load()
	 * Responsavel por verificar se existe no dom um elemento com o
	 * atributo inicializador e adicionar um listener a eles para que
	 * quando clicados iniciem o método que estiver no valor
	 * do atributo `data-attendant`
	 *
	 * @return {function} listener de click para o elemento data-attendant
	 * passando a funcao que procura o método no elemento target e o invoca
	 */
	var _load = function(){
		var $target = $("[data-attendant]");
		if(!$target){
			return
		}
		return $target.on("click", _dataInit)
	}
	/**
	 * function _init
	 * @param  {String} - method 		nome do método a ser invocado
	 * @param  {DOM Node Object } - el	elemento que receberá modificação pelo callback passado
	 * @return {Function} busca na lista de métodos disponíveios o método passado
	 */
	var _init = function(method){
	 	method = '_' + method.toCamelCase()
	 	if (!_methods[method]){
			console.warn("This method:", method, " does not exists in Attendant Service")
			return;
		}
		return _methods[method]();
	}
	/**
	 * object methods
	 * Lista de métodos que a classe suporta
	 * @type {Object}
	 */
	var _methods = {
		_newAttendance: function(){
			var widgetAttendant = _getCwsAttendant();
			if(!widgetAttendant) {
				console.warn("O Widget de atendiment não foi inicializado");
			}
			return widgetAttendant("newAttendance");
		},
		_currentAttendance: function(){
			console.log("cwsAttendant", _getCwsAttendant())
			console.log('Ir para Atendimento Atual')
		},
		_listBudgets: function(){
			console.log("cwsAttendant", _getCwsAttendant())
			window.location = '/minha-conta/orcamentos'
		},
		_emergencialBuy: function(){
			console.log("cwsAttendant", _getCwsAttendant())
			console.log('Ir para compra emergencial')
		},
		_batchBudget: function(){
			console.log("cwsAttendant", _getCwsAttendant())
			window.location = '/compra-massa'
		},
		_newProduct: function(){
			console.log("cwsAttendant", _getCwsAttendant())
			console.log('Ir para cadastro de produto')
		},
		_newClient: function(){
			console.log("cwsAttendant", _getCwsAttendant())
			console.log('Ir para cadastro de cliente')
		}
	}
	/**
	 * Retorna um objeto para expor os métodos que podem ser acessados
	 */
	return {
		method: _init,
		run: _load
	};
}());

document.addEventListener("DOMContentLoaded", cws.attendantService.run, false);
