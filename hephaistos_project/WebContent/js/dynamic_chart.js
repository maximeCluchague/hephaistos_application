var webSocket = new WebSocket("ws://localhost:8080/hephaistos_project/hephaistoswebserver");
	
	window.onload = function () {
		
		//initial value of dataPoints 
		var dps = [
			
		];	
		
		var nbCapteurConnecte = 0;
		
		var chart = new CanvasJS.Chart("chartContainer",{	
			title: {
				text: ""		
			},
			axisY: {				
				suffix: " unite"
			},		
			legend :{
				verticalAlign: 'bottom',
				horizontalAlign: "center"
			},
			data: [
			{
				type: "column",	
				bevelEnabled: true,				
				indexLabel: "{y}",
				dataPoints: dps					
			}
			]
		});
		
		webSocket.onmessage = function processMessage(sensorMessage) {
			var json = JSON.parse(sensorMessage.data);
			var commande = json.commande;
			if(commande == "NULL"){
				updateChart(sensorMessage);
			}else{
				if(commande == "deccrocherCapteur"){
					var capteur = json.idCapteur;
					deccrocherCapteur(capteur);
				}
			}
		}

		var deccrocherCapteur = function(capteur){
			for(i=0;i<dps.length;i++){
				if(capteur==dps[i].label){
					dps.splice(i,1);
					nbCapteurConnecte=nbCapteurConnecte-1;
				}
			}
			chart.render();
		}
		
		
		var updateChart = function (sensorMessage) {
			var json = JSON.parse(sensorMessage.data);
			var nomCapteur = json.idCapteur;
			var indice = -1;
			// On ajoute le capteur dans dps si celui ci n'existe pas 
			var estDansList = false;
			for(i=0;i<dps.length;i++){
				if(nomCapteur==dps[i].label){
					estDansList = true;
					indice = i;
				}
			}
			if(!estDansList){
				dps.push({label: "null", y: 0});
				indice = nbCapteurConnecte;
				dps[nbCapteurConnecte].label = nomCapteur;
				nbCapteurConnecte++;
			}
			
			// On recupere le nom et l'aquisition du capteur donnes par le message
			var capteur = parseInt(json.idCapteur);
			var value = parseInt(json.acquisition);
			
			// On met a jour le diagramme
			dps[indice] = {label: nomCapteur, y: value};
			chart.render();
		};
	}