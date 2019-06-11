
var initModule = (function(){
	try {
		var attendant = cws.attendantService;
		var $hotkeysEnabled = document.querySelector("[data-hotkeys]");
		var $boxNewAttendance = document.querySelectorAll("[data-attendant='new-attendance']")
		if(!attendant){
			return false;
		}

		// HELPERS
		//Retirar focus de input ao carregar a
		//pagina para deixar disponível os atalhos
		function letKeyboardFree(){
			if($("#search-input").get(0)){
				$("#search-input").trigger("blur")
			}
		}
		function onOpen(el){
			if(!el){
				return;
			}
			return $(el).addClass("active")
		}
		function onClose(el){
			if(!el){
				return;
			}
			return $(el).removeClass("active")
		}

		// HANDLERS
		function handleToggleEvents(ev){
			switch (ev.type){
				case "cwsAttendant.event.openModal":onOpen($boxNewAttendance); break;
				case "cwsAttendant.event.closeModal": onClose($boxNewAttendance); break;
				default: consolw.warn("Nenhum evento detectdado")
			}
		}

		// Listeners
		document.addEventListener("DOMContentLoaded", letKeyboardFree);
		// TODO Mudar no widget o nome do evento para `openAttendance` e `closeAttendance`
		document.addEventListener("cwsAttendant.event.openModal", handleToggleEvents)
		document.addEventListener("cwsAttendant.event.closeModal", handleToggleEvents)

		hotkeys('shift+n,shift+m,shift+l,shift+1, shift+p, shift+/', function(event,handler) {
		  switch(handler.key){
		    case "shift+n":attendant.method("newAttendance");break;
		    case "shift+m":attendant.method("currentAttendance");break;
		    case "shift+l":attendant.method("listBudgets");break;
		    case "shift+1":attendant.method("emergencialBuy");break;
		    case "shift+p":attendant.method("batchBudget");break;
		    case "shift+/":attendant.method("newProduct");break;
		  }
		});
	}catch(e){
		console.error("Error - :", e)
	}
}());
