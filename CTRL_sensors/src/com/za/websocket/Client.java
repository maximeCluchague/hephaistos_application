package com.za.websocket;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.URISyntaxException;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonWriter;
import javax.websocket.DeploymentException;

public class Client {
	
	// Methode qui construit le Json pour le serveur 
	private static String buildJsonData(String message){
		JsonObject jsonObject = Json.createObjectBuilder().add("message", message).build();
		StringWriter stringWriter = new StringWriter();
		try(JsonWriter jsonWriter = Json.createWriter(stringWriter)){jsonWriter.write(jsonObject);}
		return stringWriter.toString();
	}
	
	public static void main(String[] args) throws URISyntaxException, DeploymentException, IOException {
		SensorClientEndpoint client = new SensorClientEndpoint();
		BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
		System.out.println("<System> Entrer identifiant");
		String message = null; // Pour l'initialisation de l'username dans le server
		while(true){
			message = bufferedReader.readLine();
			client.sendMessage(buildJsonData(message));
		}
	}
}
