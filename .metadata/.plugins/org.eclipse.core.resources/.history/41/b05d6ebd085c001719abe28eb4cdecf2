package com.za.websocket;

import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.URISyntaxException;

import javax.json.Json;
import javax.websocket.ClientEndpoint;
import javax.websocket.ContainerProvider;
import javax.websocket.DeploymentException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;

@ClientEndpoint
public class SensorClientEndpoint {
	
	Session session = null;
	
	public SensorClientEndpoint() throws URISyntaxException {
		
		URI uri = new URI("ws://localhost:8080/hephaistos_project/hephaistoswebserver");
		
		try {
			ContainerProvider.getWebSocketContainer().connectToServer(this, uri);
			System.out.println("[<-] [CONNEXION] "+uri.toString());
		} catch (DeploymentException | IOException e) {
			System.out.println("[Impossible de ce connecter au serveur] "+uri.toString());
		}
	}
	@OnOpen
	public void processOpen(Session session){
		this.session = session;
		System.out.println("[->] Ouverture du client "+session.getId());
	}
	
	@OnMessage
	public void processMessage(String message){
		System.out.println(Json.createReader(new StringReader(message)).readObject().getString("message"));
	}
	
	public void sendMessage(String message) throws IOException {
		session.getBasicRemote().sendText(message);
		System.out.println("\tEnvoi du message "+message);

	}
	
	@OnClose
	public void processClose(){
		System.out.println("[->] Fermeture du client "+session.getId());
		System.out.println("--------------------------------------------------------------");
	}
	
}
