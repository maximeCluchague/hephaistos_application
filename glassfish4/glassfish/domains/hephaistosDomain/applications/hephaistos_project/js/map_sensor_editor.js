adresse.value = "localhost";
port.value = "8080";
document.getElementById("console").value += "Waiting for connection ...\n\n";
var webSocket = null;
var isConnect = false;

function autoScroll(){
	var textarea = document.getElementById("console");
	textarea.scrollTop = textarea.scrollHeight;
}

function connexion(){
	document.getElementById("console").value += "---> Connection request\n\n";
	autoScroll();
	try{
		webSocket.close();
		
	}catch(exception){
		
	}
	try{
		url = "ws://"+adresse.value.toString()+":"+port.value.toString()+"/hephaistos_project/hephaistoswebserver";
		
		webSocket = new WebSocket(url);
		
		webSocket.onopen = function(event){
			isConnect = true;
			document.getElementById("console").value += "<--- Open connection with WebSocket \'"+url+"\'\n\n";
			autoScroll();
		}
		
		webSocket.onclose = function(event){
			document.getElementById("console").value += "x--- Disconnected of \'"+url+"\'\n\n";
			document.getElementById("console").value += "Waiting for connection ...\n\n";
			autoScroll();
		}
		
		webSocket.onerror = function(event){
			document.getElementById("console").value += "[Unable to connect with \'"+url+"\']\n\n";
			autoScroll();
		}
		
		webSocket.onmessage = function processMessage(sensorMessage) {
			var json = JSON.parse(sensorMessage.data);
			document.getElementById("console").value += "<Message> {\"idCapteur\":\""+ json.idCapteur+"\",\"acquisition\":\""+ json.acquisition+"\",\"date\":\"" +json.date+"\",\"commande\":\""+json.commande+"\"}\n";
			autoScroll();
			if(json.commande == "deccrocherCapteur"){
				deccrocherCapteur(json.idCapteur);
			}else{
				accrocherCapteur(json.idCapteur);
				for(i=0;i<capteurOnImage.length;i++){
					if(json.idCapteur==capteurOnImage[i].idCapteur){
						var x1 = capteurOnImage[i].x1;
						var y1 = capteurOnImage[i].y1;
						var x2 = capteurOnImage[i].x2;
						var y2 = capteurOnImage[i].y2;
						var idCapteur = capteurOnImage[i].idCapteur;
						updateLine(x1,y1,x2,y2,idCapteur,json.acquisition);
						
						updateZone(idCapteur,json.acquisition);
						
					}
				}
			}
		}
	}catch(exception){
		document.getElementById("console").value += "[Unable to connect with Server]\n\n";
	}
}
	
function deconnexion(){
	if(isConnect){
		document.getElementById("console").value += "---> Disconnection request\n\n";
		autoScroll();
		webSocket.close();
		isConnect = false;
	}else{
		document.getElementById("console").value += "You are not logged with the Server\n\n";
	}
	autoScroll();
}

function clearConsole(){
	document.getElementById("console").value = "";
}
	var imageChargee = false;

	//var url = "ws://localhost:8080/hephaistos_project/hephaistoswebserver";
	
	//var webSocket = new WebSocket(url);
	
	var context = document.getElementById('myCanvas').getContext("2d");
	
	urlImage.value = "images/planBatiment.jpg";
	
	var capteurDispo = [];
	nbCapteurDispo =0;
	
	nbOption = 0;
	
	var capteurOnImage = [];
	
	var zone = [];
	
	var firstPointSelected = false;
	var secondPointSelected = false;
	var zonePointSelected = false;
	
	var ajouter = function(){
		if(imageChargee){
			if(nbOption>0){
				if(firstPointSelected && secondPointSelected){
					firstPointSelected = false;
					secondPointSelected = false;
					
					var e = document.getElementById("capteurs");
					var currentSelect = e.options[e.selectedIndex].text;
					capteurOnImage.push({idCapteur:currentSelect,x1:x1.value,y1:y1.value,x2:x2.value,y2:y2.value});
					
					// On met a jour le champ capteur pour créer les arrete du graphe
					var capteurs = document.getElementById ("capteursAjoutés");
					var newOption = new Option (currentSelect, "value");
					capteurs.options.add (newOption);
					
					// On trace une premiere ligne
					context.strokeStyle='#FF0000';
			        context.beginPath();
			        context.moveTo(parseInt(x1.value),parseInt(y1.value));
			        context.lineTo(parseInt(x2.value),parseInt(y2.value));
			        context.lineWidth = 5;
			        context.stroke();
			        
			        // On dessine le nom du capteur
			        context.fillStyle = "#FFFFFF";
			        context.fillRect((parseInt(x1.value)+parseInt(x2.value))/2+20,(parseInt(y1.value)+parseInt(y2.value))/2-40, 35 + currentSelect.length*8, 25);
			        context.strokeStyle = "#444444";
			        context.lineWidth = 2;
			        context.strokeRect((parseInt(x1.value)+parseInt(x2.value))/2+20,(parseInt(y1.value)+parseInt(y2.value))/2-40, 35 + currentSelect.length*8, 25);
			        context.fillStyle = "blue";
			        context.textAlign="start"; 
			        context.font = "15px Arial";
			        context.fillText("ID : "+currentSelect,(parseInt(x1.value)+parseInt(x2.value))/2+25,(parseInt(y1.value)+parseInt(y2.value))/2-22); 
			        
			        
			        removeOption();
					x1.value = "";
					y1.value = "";
					x2.value = "";
					y2.value = "";
				}else{
					alert("Veuillez sélectionner des coordonnées sur l'image en placant votre curseur sur le l'image puis en appuyant sur la touche ENTRER");
				}
			}else{
				alert("Aucun capteur disponible ... ");
			}
		}else{
			alert("Veuillez charger une image");
		}
	}
	
	var zoneExiste = function(nomZone){
		for(i=0;i<zone.length;i++){
			if(zone[i].nomZone==nomZone){
				return true;
			}
		}return false;
	}
	
	var ajouterZone = function(){
		if(imageChargee){
			if(nomZone.value.length>0){
				if(zonePointSelected){
					if(!zoneExiste(nomZone.value)){
						// On stocke la nouvelle zone dans une liste
						zone.push({nomZone:nomZone.value,x:x.value,y:y.value,r:r.value,nbPersonne:0,capteurVoison:[]});
						
						var zone1 = document.getElementById ("zone1");
						var newOption = new Option (nomZone.value, "value");
						zone1.options.add (newOption);
						var zone2 = document.getElementById ("zone2");
						var newOption = new Option (nomZone.value, "value");
						zone2.options.add (newOption);
						
						// On dessine le cercle
						context.beginPath();
						context.fillStyle="#9EC8ED"
						context.arc(x.value, y.value, r.value, 0, 2 * Math.PI);
						context.fill();
						context.strokeStyle="#3D5D87";
						context.beginPath();
						context.lineWidth="2";
						context.arc(x.value, y.value, r.value, 0, 2 * Math.PI);
						context.stroke();
						
						// On écrit le nom de la zone
						context.fillStyle = "#263A61";
					    context.font = "15px Arial";
					    context.textAlign="center"; 
					    context.fillText(nomZone.value,x.value,parseInt(y.value)-parseInt(r.value/3));
					 	// On écrit le nombre de personnes présent dans la zone
					    context.font = "42px Arial";
					    context.fillText(nbPersonne.value,x.value,parseInt(y.value)+parseInt(r.value/2));
					    x.value = "";
						y.value = "";
						nomZone.value ="";
						nbPersonne.value="0";
						zonePointSelected = false;
					}else{
						alert("Le nom de zone est déja utilisé");
					}
				}else{
					alert("Veuillez sélectionner des coordonnées pour ajouter une nouvelle zone");
				}
			}else{
				alert("Veuillez entrer un nom pour créer une nouvelle zone");
			}

		}else{
			alert("Veuillez charger une image");
		}
	}
	

	
	var updateZone = function(idCapteur,acquisition){
		if(acquisition>0){
			if(zone.length>0){
				document.getElementById("console").value +="zone.length="+zone.length+"\n";
				for(i=0;i<zone.length;i++){
					var capteurVoisin = zone[i].capteurVoison;
					document.getElementById("console").value +=capteurVoisin.toString();
					//if(capteurVoisin.length>0){
					//	for(j=0;j<capteurVoisin.length;j++){
					//		document.getElementById("console").value +="\tj:"+i+" eme itération\n";
					//	}
					//}
				}
			}
		}

	}
	
	var lier = function(){
		try{
			var zone1 = document.getElementById("zone1");
			var z1 = zone1.options[zone1.selectedIndex].text;
			
			var zone2 = document.getElementById("zone2");
			var z2 = zone2.options[zone2.selectedIndex].text;
			
			var capteur = document.getElementById("capteursAjoutés");
			var c = capteur.options[capteur.selectedIndex].text;
			if(z1 != z2){
				//
				// Debut CREATION ARRETE
				//
				for(i=0;i<zone.length;i++){
					if(zone[i].nomZone==z1){
						zone[i].capteurVoison.push(c);
						var voisinZ1 = zone[i].capteurVoison;
						document.getElementById("console").value += "<CONSTRUCTION GRAPHE> Capteur "+zone[i].capteurVoison[0]+" ajoutée à "+ zone[i].nomZone+"\n";
						
					}
					if(zone[i].nomZone==z2){
						zone[i].capteurVoison.push(c);
						var voisinZ2 = zone[i].capteurVoison;
						document.getElementById("console").value += "<CONSTRUCTION GRAPHE> Capteur "+zone[i].capteurVoison[0]+" ajoutée à "+ zone[i].nomZone+"\n";
					}
				}
				//
				// Fin CREATION ARRETE
				//
			}else{
				alert("Erreur : Vous devez séléctionner 2 zones différentes ! ");
			}
		}catch(exception){
			alert("Il manque des éléments ... ");
		}
	}
	
	var annuler=function(){
		firstPointSelected = false;
		secondPointSelected = false;
		x1.value = "";
		y1.value = "";
		x2.value = "";
		y2.value = "";
	}
	
	var deccrocherCapteur = function(capteur){
		for(i=0;i<capteurDispo.length;i++){
			if(capteur==capteurDispo[i]){
				capteurDispo.splice(i,1);
				nbCapteurDispo=nbCapteurDispo-1;
			}
		}
	}
	
	var accrocherCapteur = function(capteur){
		var estAccrocher =false;
		for(i=0;i<capteurDispo.length;i++){
			if(capteur==capteurDispo[i]){
				estAccrocher =true;
			}
		}
		if(!estAccrocher){
			nbCapteurDispo++;
			capteurDispo.push(capteur);
			addOption(capteur);
		}
	}
	
	function addOption(capteur)
	{
	    var select = document.getElementById ("capteurs");
	    var newOption = new Option (capteur, "value");
	    select.options.add (newOption);
	    nbOption++;
	}
	
	function removeOption(){
		var x = document.getElementById("capteurs");
	    x.remove(x.selectedIndex);
	    nbOption=nbOption-1;
	}

	
	var imgWidth;
	var imgHeight;

	function chargerImage(){
		var img = new Image();
		img.onload = function () {
		    context.drawImage(img,0,0, img.width, img.height);
		};
		
		img.src = urlImage.value;
		
		imgWidth = img.width;
		myCanvas.width = img.width;
		
		imgHeight = img.height;
		myCanvas.height = img.height;
		
		imageChargee = true;
	}
	
	window.addEventListener('keydown',this.check,false);
	
	function check(e) {
		if(e.keyCode === 17){
	    	ajouterZone();
		}else{
			if(!firstPointSelected){
				if(e.keyCode === 13){
			    	alert("Vous avez selectionné le premier point, veuillez selectionner le second en appuyant sur la touche 'Entrer'");
			    	if(x1.value.length>0){
			    		firstPointSelected = true;
			    	}
				}
			}else{
				if(!secondPointSelected){
					if(e.keyCode === 13){
				    	alert("Les points sont enregistrer appuyer sur 'Ajouter' pour confirmer ou 'Annuler' pour annuler la sélection");
				    	if(x2.value.length>0){
				    		secondPointSelected = true;
				    	}
				    }
				}
			}
		}
	}
	
	function getWindowHeight() {
	    var windowHeight=0;
	    if (typeof(window.innerHeight)=='number') {
	        windowHeight=window.innerHeight;
	    } else {
	        if (document.documentElement&& document.documentElement.clientHeight) {
	            windowHeight = document.documentElement.clientHeight;
	        } else {
	            if (document.body&&document.body.clientHeight) {
	                windowHeight=document.body.clientHeight;
	            }
	        }
	    }
	    return windowHeight;
	}
	
	function getWindowWidth() {
	 var windowWidth=0;
	 if (typeof(window.innerWidth)=='number') {
	  windowWidth=window.innerWidth;
	    } else {
	  if (document.documentElement&& document.documentElement.clientWidth) {
	   windowWidth = document.documentElement.clientWidth;
	        } else {
	   if (document.body&&document.body.clientWidth) {
	    windowWidth=document.body.clientWidth;
	            }
	        }
	    }
	 return windowWidth;
	}
	
      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');

      canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        ny=getWindowHeight();
        nx=Math.min(1014,Math.max(getWindowWidth(),720)+14);
        x.value = parseInt(mousePos.x/((nx-110)/imgWidth));
        y.value = parseInt(mousePos.y/((nx-110)/imgWidth));
        zonePointSelected = true;
        if(!firstPointSelected){
	        x1.value = parseInt(mousePos.x/((nx-110)/imgWidth));
	        y1.value = parseInt(mousePos.y/((nx-110)/imgWidth));
        }else{
        	if(!secondPointSelected){
    	        x2.value = parseInt(mousePos.x/((nx-110)/imgWidth));
    	        y2.value = parseInt(mousePos.y/((nx-110)/imgWidth));
            }
        }
      }, false);
	
	function updateLine(x1,y1,x2,y2,idCapteur,acquisition){
        
        // Changement de couleur
        var acq = parseInt(acquisition);
        if(acq>0){
        	context.strokeStyle='#00FF00';
        }else{
        	context.strokeStyle='#FF0000';
        }
        
        //Tracé de la barriere capteur
        
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.lineWidth = 5;
        context.stroke(); 
    }