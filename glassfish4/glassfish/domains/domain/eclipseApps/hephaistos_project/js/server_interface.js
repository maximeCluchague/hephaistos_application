			adresse.value = "localhost";
			port.value = "8080";
			//commande.value = "NULL";
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
						
						if(new String(json.commande).valueOf()!=new String("NULL").valueOf()){
							document.getElementById("console").value += "<Result Commande> "+ json.commande+"\n";
						}else{
							document.getElementById("console").value += "<Message> {\"idCapteur\":\""+ json.idCapteur+"\",\"acquisition\":\""+ json.acquisition+"\",\"date\":\"" +json.date+"\",\"commande\":\""+json.commande+"\"}\n";
						}
						autoScroll();
					}
					
				}catch(exception){
					document.getElementById("console").value += "[Unable to connect with Server]\n\n";
					autoScroll();
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
			
			function send(){
				// On créer le Json qui va etre envoyé
				if(isConnect){
					var date=new Date();
					var messageJson = {"idCapteur": idCapteur.value,"acquisition": acquisition.value,"date": date,"commande":commande.value};
					
					webSocket.send(JSON.stringify(messageJson));
					// On remet les textField de la page html vide
					idCapteur.value = "";
					acquisition.value = "";
					commande.value = "NULL";

				}else{
					document.getElementById("console").value += "You must be logged in to forward a message to the Server ... \n";
				}
				autoScroll();
			}
			
			window.onbeforeunload = function(){
				websocket.onclose = function(){};
				websocket.close();
				
			};
		
			function clearConsole(){
				document.getElementById("console").value = "";
			}