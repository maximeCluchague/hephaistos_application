package com.za.websocket;

import java.io.IOException;
import java.io.StringWriter;
import java.net.URISyntaxException;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonWriter;
import javax.websocket.DeploymentException;



public class sendData {
	
	// Methode qui construit le Json pour le serveur 
	private static String buildJsonData(String message){
		JsonObject jsonObject = Json.createObjectBuilder().add("message", message).build();
		StringWriter stringWriter = new StringWriter();
		try(JsonWriter jsonWriter = Json.createWriter(stringWriter)){jsonWriter.write(jsonObject);}
		return stringWriter.toString();
	}
		
	public static void main(String[] args) throws URISyntaxException, DeploymentException, IOException {
		
		SensorClientEndpoint client = new SensorClientEndpoint();
		// On transmet l'identifiant du capteur
		client.sendMessage(buildJsonData(args[0]));
		// On transmet la valeur de l'aquisition 
		client.sendMessage(buildJsonData(args[1]));
		client.session.close();	
	}
}
