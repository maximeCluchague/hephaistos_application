package com.za.websocket;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonWriter;
import javax.websocket.ClientEndpoint;
import javax.websocket.ContainerProvider;
import javax.websocket.DeploymentException;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;

@ClientEndpoint
public class SensorClientEndpoint {
	
	Session session = null;
	
	public SensorClientEndpoint() throws URISyntaxException, DeploymentException, IOException{
		URI uri = new URI("ws://localhost:8080/hephaistos_project/hephaistoswebserver");
		ContainerProvider.getWebSocketContainer().connectToServer(this, uri);
	}
	@OnOpen
	public void processOpen(Session session){
		this.session = session;
	}
	
	@OnMessage
	public void processMessage(String message){
		System.out.println(Json.createReader(new StringReader(message)).readObject().getString("message"));
	}
	
	public void sendMessage(String message) throws IOException{
		session.getBasicRemote().sendText(message);
	}
}
