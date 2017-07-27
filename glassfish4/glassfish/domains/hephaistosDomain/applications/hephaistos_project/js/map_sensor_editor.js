adresse.value = "localhost";
port.value = "8080";
document.getElementById("console").value += "Waiting for connection ...\n\n";
var webSocket = null;
var isConnect = false;
var URLimageChargee;

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
				for(var i=0;i<capteurOnImage.length;i++){
					if(json.idCapteur==capteurOnImage[i].idCapteur){
						var x1 = capteurOnImage[i].x1;
						var y1 = capteurOnImage[i].y1;
						var x2 = capteurOnImage[i].x2;
						var y2 = capteurOnImage[i].y2;
						var idCapteur = capteurOnImage[i].idCapteur;
						updateLine(x1,y1,x2,y2,idCapteur,json.acquisition);
						
						
						
					}
				}
			}
			// On met a jour le nombre de personne présent dans chaque Zone
			updateZoneVoisineCapteur(json.idCapteur,json.acquisition);
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
	/////////////////////////////////
	//var url = "ws://localhost:8080/hephaistos_project/hephaistoswebserver";
	
	//var webSocket = new WebSocket(url);
	////////////////////////////////////////////
	
	var context = document.getElementById('myCanvas').getContext("2d");
	
	urlImage.value = "images/plan_pompidou.png";
	
	var capteurDispo = [];
	nbCapteurDispo =0;
	
	nbOption = 0;
	
	var capteurOnImage = [];
	
	var zone = [];
	
	var firstPointSelected = false;
	var secondPointSelected = false;
	var zonePointSelected = false;
	
	var ajouter = function(){
			firstPointSelected = false;
			secondPointSelected = false;
					
			var e = document.getElementById("capteurs");
			var currentSelect = e.options[e.selectedIndex].text;
			capteurOnImage.push({idCapteur:currentSelect,x1:x1.value,y1:y1.value,x2:x2.value,y2:y2.value});
					
			// On met a jour le champ capteur pour créer les arrete du graphe
			var capteurs = document.getElementById ("capteursAjoutés");
			var newOption = new Option (currentSelect, "value");
			capteurs.options.add (newOption);
			
			var capteursToRemove = document.getElementById ("capteurToRemove");
			var newOption = new Option (currentSelect, "value");
			capteursToRemove.options.add (newOption);
					
			// On trace une premiere ligne
			context.strokeStyle='#FF0000';
			context.beginPath();
			context.lineCap = 'round';
			context.moveTo(parseInt(x1.value),parseInt(y1.value));
			context.lineTo(parseInt(x2.value),parseInt(y2.value));
			context.lineWidth = 7;
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
			x1.value="";
			x2.value=""; 
			y1.value=""; 
			y2.value=""; 
			removeOption();
	}

	
	var zoneExiste = function(nomZone){
		for(var i=0;i<zone.length;i++){
			if(zone[i].nomZone==nomZone){
				return true;
			}
		}return false;
	}
	
	var addZone = false;
	var addSensor = false;
	
	document.getElementById('myCanvas').onclick = function(){
		// procédure ajout de zone 
		wantDrawArea = false;
		wantDrawSensor = false
		if(addZone){
			ajouterZone();
			addZone=false;
		}
		else{
			if(addSensor){
				if(!firstPointSelected){
					precX=x.value;
					precY=y.value;
					wantDrawArrete = true;
					firstPointSelected = true;
				}else{
					secondPointSelected = true;
					ajouter();
					addSensor = false;
					wantDrawArrete = false;
				}
			}
		}
	}
	
	document.getElementById('addArea').onclick = function(){
		if(imageChargee){
			if(nomZone.value.length>0){
				if(!zoneExiste(nomZone.value)){
					addZone = true;
					wantDrawArea = true;
					//alert("Please select a point on the image");
				}else{
					alert("The zone name is already used");
				}
			}else{
				alert("Please enter a name to create a new zone");
			}
		}else{
			alert("Please load an image");
		}
	}
	
	document.getElementById('addSensor').onclick = function(){
		if(imageChargee){
			if(nbOption>0){
				addSensor=true;
				wantDrawSensor = true;
				//alert("Please select two point on the image");
			}else{
				alert("No sensor available ... Please check your connection to the server in the left panel and if sensors are connected to the server");
			}
		}else{
			alert("Please load an image by entering the absolute path in the section 'New map'");
		}
	}
	function refreshMap(){
		context.fillStyle = "#FFFFFF";
		context.fillRect(0,0, imgWidth, imgHeight);
		context.drawImage(image,0,0, imgWidth, imgHeight);
		
		imageChargee = true;
		
		// a) On redessine les capteurs
		for(var i=0;i<capteurOnImage.length;i++){
			var idCapteur=capteurOnImage[i].idCapteur;
			var x1=parseInt(capteurOnImage[i].x1);
			var y1=parseInt(capteurOnImage[i].y1);
			var x2=parseInt(capteurOnImage[i].x2);
			var y2=parseInt(capteurOnImage[i].y2);
			// On trace une premiere ligne
			context.strokeStyle='#FF0000';
			context.beginPath();
			context.lineCap = 'round';
			context.moveTo(x1,y1);
			context.lineTo(x2,y2);
			context.lineWidth = 7;
			context.stroke();
			        
			// On dessine le nom du capteur
			context.fillStyle = "#FFFFFF";
			context.fillRect((x1+x2)/2+20,(y1+y2)/2-40, 35 + idCapteur.length*8, 25);
			context.strokeStyle = "#444444";
			context.lineWidth = 2;
			context.strokeRect((x1+x2)/2+20,(y1+y2)/2-40, 35 + idCapteur.length*8, 25);
			context.fillStyle = "blue";
			context.textAlign="start"; 
			context.font = "15px Arial";
			context.fillText("ID : "+idCapteur,(x1+x2)/2+25,(y1+y2)/2-22); 
			
		}
		// b) On dessine les liaison ainsi que les zones voisines
		var val=0;
		while(val<listeArrete.length){
			var capteur =listeArrete[val].capteur;
			var Z1=listeArrete[val].voisinZ1;
			var Z2=listeArrete[val].voisinZ2;
			var couleur="#8aecff";
			drawArrete(capteur,Z1,Z2,couleur);
			val++;
		}

		// c) On dessine les zones
		for(var i=0;i<zone.length;i++){
			drawZone(zone[i].nomZone,zone[i].x,zone[i].y,zone[i].r,zone[i].nbPersonne);
		}
	}
	
	document.getElementById('cancelArea').onclick = function(){
		addZone = false;
		wantDrawArea=false;
	}
	
	document.getElementById('resetPeopleNumber').onclick = function(){
		for(var i=0;i<zone.length;i++){
			zone[i].nbPersonne = "0";
		}
		refreshMap();
	}
	
	document.getElementById('updatePeople').onclick = function(){
		var area = document.getElementById('areaToRefresh');
		var currentSelect = area.options[area.selectedIndex].text;
		for(var i=0;i<zone.length;i++){
			if(zone[i].nomZone==currentSelect)
			zone[i].nbPersonne = nbPeople.value;
		}
		refreshMap();
	}
	
	document.getElementById('removeSensor').onclick = function(){
		
		var x = document.getElementById("capteurToRemove");
		
		// On retire le capteur de la liste des capteurs présent sur l'image
		var currentSelect = x.options[x.selectedIndex].text;
		
		for(var i=0;i<listeArrete.length;i++){
			if(listeArrete[i].capteur==currentSelect){
				listeArrete.splice(i,1);
			}
		}
		for(var i=0;i<capteurOnImage.length;i++){
			if(capteurOnImage[i].idCapteur==currentSelect){
				capteurOnImage.splice(i,1);
			}
		}
		// On retire le capteur dans la liste déroullante des capteurs sur l'imageet on l'ajoute sur celui des capteurs dispo
		x.remove(x.selectedIndex);
		var select = document.getElementById ("capteurs");
		
		// On remet le capteur supprimé dans la liste déroulante des capteurs dispo
	    var newOption = new Option (currentSelect, "value");
	    select.options.add (newOption);
	    nbOption++;
	    
	    // On actualise les options du select de idSensor dnas la rubrique create link
		var oSelect = document.getElementById('capteursAjoutés');
		for (var i=0; i<oSelect.length; i++){
			if (oSelect.options[i].innerHTML == currentSelect ){
				oSelect.remove(i);
			}
		}

		refreshMap();
	}

	document.getElementById("removeArea").onclick = function(){
		var listArea = document.getElementById("areaToRemove");
		var currentSelect = listArea.options[listArea.selectedIndex].text;

		var k =0;
		while(k<listeArrete.length){
			if(listeArrete[k].voisinZ1==currentSelect){
				var capteurs = document.getElementById ("capteursAjoutés");
				var newOption = new Option (listeArrete[k].capteur, "value");
				capteurs.options.add (newOption);
				
				listeArrete.splice(k,1);
			    nbOption++;
			}else{
				k++;
			}	
		}
		var k=0;
		while(k<listeArrete.length){
			if(listeArrete[k].voisinZ2==currentSelect){
				var capteurs = document.getElementById ("capteursAjoutés");
				var newOption = new Option (listeArrete[k].capteur, "value");
				capteurs.options.add (newOption);
				
				listeArrete.splice(k,1);
			    nbOption++;
			}else{
				k++;
			}	
		}
		
		var i=0;
		while(i<zone.length){
			if(zone[i].nomZone==currentSelect){
				zone.splice(i,1);
			}else{
				i++;
			}
		}
		var zone1 = document.getElementById('zone1');
		var zone2 = document.getElementById('zone2');
		
		var j=0;
		while (j<zone1.length){
			if (zone1.options[j].innerHTML == currentSelect ){
				zone1.remove(j);
			}else{
				j++;
			}
		}
		var j=0;
		while (j<zone2.length){
			if (zone2.options[j].innerHTML == currentSelect ){
				zone2.remove(j);
			}else{
				j++;
			}
		}
		
		var area = document.getElementById('areaToRefresh');
		var j=0;
		while (j<area.length){
			if (area.options[j].innerHTML == currentSelect ){
				area.remove(j);
			}else{
				j++;
			}
		}
		listArea.remove(listArea.selectedIndex);

		refreshMap();
	}
	
	var ajouterZone = function(){
		// On ajoute la zone dans la liste des zones qui peuvent être supprimés
		var listArea = document.getElementById("areaToRemove");
		var newOption = new Option (nomZone.value, "value");
		listArea.options.add (newOption);
		
		var listAreaRefresh = document.getElementById("areaToRefresh");
		var newOption = new Option (nomZone.value, "value");
		listAreaRefresh.options.add (newOption);
		
		// On stocke la nouvelle zone dans une liste
		zone.push({nomZone:nomZone.value,x:x.value,y:y.value,r:r.value,nbPersonne:nbPersonne.value});
						
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
		nomZone.placeholder ="Name";nomZone.value ="";
		nbPersonne.value="0";
		zonePointSelected = false;
	}
	
	document.querySelector("#help").onclick = function() {
		if (window.getComputedStyle(document.querySelector('#helpDetail')).display=='none'){
			document.querySelector("#helpDetail").style.display="block";
			document.querySelector("#myCanvas").style.display="none";
		} else {
			document.querySelector("#helpDetail").style.display="none";
			document.querySelector("#myCanvas").style.display="block";
		}
	}
	
	function updateZoneVoisineCapteur(nomCapteur,acquisition){
		if(parseInt(acquisition)>0){
			for(var i=0;i<listeArrete.length;i++){
				if(listeArrete[i].capteur==nomCapteur){
					var Z1 = listeArrete[i].voisinZ1;
					var Z2 = listeArrete[i].voisinZ2;
					
					// ON PEUT UTILISER UN ALGORITHME PLUS EFFICACE ICI C'EST UN ALGO HEURISTIQUE POUR TESTER LE FONCTIONNEMENT
						
					// On récupère le nombre de personne dans la zone 1 avant l'activation du capteur
					var nbPersonnez1;
					for(var i=0;i<zone.length;i++){
						if(zone[i].nomZone==Z1){
							nbPersonnez1 = parseInt(zone[i].nbPersonne);
						}
					}
					
					// On récupère le nombre de personne dans la zone 2 avant l'activation du capteur
					var nbPersonnez2;
					for(var i=0;i<zone.length;i++){
						if(zone[i].nomZone==Z2){
							nbPersonnez2 = parseInt(zone[i].nbPersonne);
						}
					}
					drawArrete(nomCapteur,Z1,Z2,"#0000FF");
					// Algo de mise à jour du nombre de personne peut-être modifié
					
					if(!(nbPersonnez1==0 && nbPersonnez2==0)){
						if(nbPersonnez1==0){
							updateZone(Z1,nbPersonnez1+1);
							updateZone(Z2,nbPersonnez2-1);
						}else{
							if(nbPersonnez2==0){
								updateZone(Z1,nbPersonnez1-1);
								updateZone(Z2,nbPersonnez2+1);
							}
							else{
								if(Math.random()>0.5){
									updateZone(Z1,nbPersonnez1-1);
									updateZone(Z2,nbPersonnez2+1);
								}else{
									updateZone(Z1,nbPersonnez1+1);
									updateZone(Z2,nbPersonnez2-1);
								}
							}
						}
					}
				}
			}
		}
		else{
			for(var i=0;i<listeArrete.length;i++){
				if(listeArrete[i].capteur==nomCapteur){
					var Z1 = listeArrete[i].voisinZ1;
					var Z2 = listeArrete[i].voisinZ2;
				}
			}
			drawArrete(nomCapteur,Z1,Z2,"#8aecff");
		}
	}
	
	function updateZone(nomZone,nbPersonne){
		for(var i=0;i<zone.length;i++){
			if(zone[i].nomZone==nomZone){
				// On met a jour la zone dans la liste
				zone[i]={nomZone:zone[i].nomZone,x:zone[i].x,y:zone[i].y,r:zone[i].r,nbPersonne:nbPersonne};
				drawZone(nomZone,zone[i].x,zone[i].y,zone[i].r,zone[i].nbPersonne);
			}
		}
	}

	function drawZone(nomZone,x,y,r,nbPersonne){
		// On dessine le cercle
		context.beginPath();
		context.fillStyle="#9EC8ED"
		context.arc(x,y, r, 0, 2 * Math.PI);
		context.fill();
		context.strokeStyle="#3D5D87";
		context.beginPath();
		context.lineWidth="2";
		context.arc(x, y, r, 0, 2 * Math.PI);
		context.stroke();
		
		// On écrit le nom de la zone
		context.fillStyle = "#263A61";
	    context.font = "15px Arial";
	    context.textAlign="center"; 
	    context.fillText(nomZone,x,parseInt(y)-parseInt(r/3));
	 	// On écrit le nombre de personnes présent dans la zone
	    context.font = "42px Arial";
	    context.fillText(nbPersonne,x,parseInt(y)+parseInt(r/2));
	}
	
	var listeArrete=[];
	
	function drawArrete(c,z1,z2,color){
		// Coordonnées de la zone 1
		var x1;
	    var y1;
	    // Coordonnées de la zone 2
	    var x2;
	    var y2;
	    // Coordonnées du capteur 
	    var x3;
	    var y3;

	    for(var i=0;i<zone.length;i++){
	    	if(zone[i].nomZone==z1){
	    		x1=parseInt(zone[i].x);
	    		y1=parseInt(zone[i].y);
	    	}
	    	if(zone[i].nomZone==z2){
	    		x2=parseInt(zone[i].x);
	    		y2=parseInt(zone[i].y);
	    	}
	    }

	    var ax3;
	    var ay3;
	    var bx3;
	    var by3;
	    
	    for(var i=0;i<capteurOnImage.length;i++){
	    	if(capteurOnImage[i].idCapteur==c){
	    		ax3=parseInt(capteurOnImage[i].x1);
	    		ay3=parseInt(capteurOnImage[i].y1);
	    		bx3=parseInt(capteurOnImage[i].x2);
	    		by3=parseInt(capteurOnImage[i].y2);
	    		
	    		x3=(parseInt(capteurOnImage[i].x1)+parseInt(capteurOnImage[i].x2))/2;
	    		y3=(parseInt(capteurOnImage[i].y1)+parseInt(capteurOnImage[i].y2))/2;
	    	}
	    }
	    
	    var d1 = 0.7*Math.sqrt((x3-x1)*(x3-x1)+(y3-y1)*(y3-y1))/Math.sqrt((bx3-ax3)*(bx3-ax3)+(by3-ay3)*(by3-ay3));
	    var d2 = 0.7*Math.sqrt((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2))/Math.sqrt((bx3-ax3)*(bx3-ax3)+(by3-ay3)*(by3-ay3));;
	    
	    var SigneSinTeta = (x2-x1)*(by3-ay3)-(y2-y1)*(bx3-ax3);

	    if(SigneSinTeta<0){
		    context.beginPath();            
		    context.lineWidth="2";
		    context.strokeStyle=color; 
		    context.moveTo(x1,y1);
		    context.quadraticCurveTo(x3+d1*by3-d1*y3,y3-d1*bx3+d1*x3,x3,y3);
		    context.stroke();
		    
		    context.beginPath();            
		    context.lineWidth="2";
		    context.strokeStyle=color; 
		    context.moveTo(x3,y3);
		    context.quadraticCurveTo(x3+d2*y3-d2*by3,y3+d2*bx3-d2*x3,x2,y2);
		    context.stroke();

	    }else{
	    	context.beginPath();            
		    context.lineWidth="2";
		    context.strokeStyle=color; 
		    context.moveTo(x3,y3);
		    context.quadraticCurveTo(x3+d2*by3-d2*y3,y3-d2*bx3+d2*x3,x2,y2);
		    context.stroke();
		    
		    context.beginPath();            
		    context.lineWidth="2";
		    context.strokeStyle=color; 
		    context.moveTo(x1,y1);
		    context.quadraticCurveTo(x3+d1*y3-d1*by3,y3+d1*bx3-d1*x3,x3,y3);
		    context.stroke();
	    }
	    
	    // On dessine la zone par dessus l'arrete
	    for(var i=0;i<zone.length;i++){
			if(zone[i].nomZone==z1){
				updateZone(z1,parseInt(zone[i].nbPersonne));
			}
		}

	    for(var i=0;i<zone.length;i++){
			if(zone[i].nomZone==z2){
				updateZone(z2,parseInt(zone[i].nbPersonne));
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
				// Debut DRAW ARRETE
				//
		
				listeArrete.push({capteur:c,voisinZ1:z1,voisinZ2:z2});
				
				var x = document.getElementById("capteursAjoutés");
			    x.remove(x.selectedIndex);
			    // On dessine le lien entre les 2 zone par une courbe bezier qui coupe le capteur
			    // Coordonnées de la zone 1
			    
			    drawArrete(c,z1,z2,"#8aecff");
			    
				//
				// Fin DRAW ARRETE
				//
			}else{
				alert("Error: You must select 2 different areas !");
			}
		}catch(exception){
			alert("There is a lack of elements to create liaison ... ");
		}
	}
	
	var annuler=function(){
		addSensor = false;
		firstPointSelected = false;
		secondPointSelected = false;
		wantDrawArrete = false;
		wantDrawSensor = false;
		refreshMap();
		x1.value = "";
		y1.value = "";
		x2.value = "";
		y2.value = "";
	}
	
	var deccrocherCapteur = function(capteur){
		for(var i=0;i<capteurDispo.length;i++){
			if(capteur==capteurDispo[i]){
				capteurDispo.splice(i,1);
				nbCapteurDispo=nbCapteurDispo-1;
			}
		}
	}
	
	var accrocherCapteur = function(capteur){
		var estAccrocher =false;
		for(var i=0;i<capteurDispo.length;i++){
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
	
	var image;
	function chargerImage(){
		var img=new Image();
		URLimageChargee = urlImage.value;
		img.src = urlImage.value;

		imgWidth = img.width;
		myCanvas.width = img.width;
		
		imgHeight = img.height;
		myCanvas.height = img.height;
		image=img;
		drawImage(img);
		imageChargee = true;
		
	}
	
	var PATHimg = document.getElementById("urlImage");
	PATHimg.addEventListener('change', chargerImage, false);
	
	function drawImage(img){
		context.drawImage(img,0,0, img.width, img.height);
	}
	
	document.querySelector("#load").onclick = function() {
		document.querySelector("#myCanvas").style.display="block";
		chargerImage();
		document.querySelector("#panelBoutton").style.display="block";
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
	
	var precX=0;
	var precY=0;
	var wantDrawArrete = false;
	var wantDrawArea = false;
	var wantDrawSensor = false;
	
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

        nx=document.getElementById('myCanvas').offsetWidth;
        
        x.value = parseInt(mousePos.x*imgWidth/nx);
        y.value = parseInt(mousePos.y*imgWidth/nx);
        
        if(wantDrawArrete){
	        refreshMap();
	        context.strokeStyle='#FF0000';
	        context.lineCap = 'round';
	        context.lineWidth = 3;
	        context.beginPath();
	        context.moveTo(precX,precY);
	        context.lineTo(x.value,y.value);
	        context.stroke();
        }
        if(wantDrawSensor){
	        refreshMap();
	        context.beginPath();
			context.fillStyle="#FF0000"
			context.arc(x.value,y.value, 3, 0, 2 * Math.PI);
			context.fill();
        }
        if(wantDrawArea){
	        refreshMap();
	        context.strokeStyle="#3D5D87";
	        context.beginPath();
	        context.lineWidth="2";
	        context.arc(x.value, y.value, r.value, 0, 2 * Math.PI);
	        context.stroke();
        }

        zonePointSelected = true;
        if(!firstPointSelected){
	        x1.value = parseInt(mousePos.x*imgWidth/nx);
	        y1.value = parseInt(mousePos.y*imgWidth/nx);
        }else{
        	if(!secondPointSelected){
    	        x2.value = parseInt(mousePos.x*imgWidth/nx);
    	        y2.value = parseInt(mousePos.y*imgWidth/nx);
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
        context.lineCap = 'round';
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.lineWidth = 7;
        context.stroke(); 
        
        // Dessiner son nom
        context.beginPath();
        context.fillStyle = "#FFFFFF";
        context.fillRect((parseInt(x1)+parseInt(x2))/2+20,(parseInt(y1)+parseInt(y2))/2-40, 35 + idCapteur.length*8, 25);
        context.strokeStyle = "#444444";
        context.lineWidth = 2;
        context.strokeRect((parseInt(x1)+parseInt(x2))/2+20,(parseInt(y1)+parseInt(y2))/2-40, 35 + idCapteur.length*8, 25);
        context.fillStyle = "blue";
        context.textAlign="start"; 
        context.font = "15px Arial";
        context.fillText("ID : "+idCapteur,(parseInt(x1)+parseInt(x2))/2+25,(parseInt(y1)+parseInt(y2))/2-22); 
        
        
    }