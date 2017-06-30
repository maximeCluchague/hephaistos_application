package com.za.websocket;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Date;

public class testClientJava {
	public static void main(String[] args) throws URISyntaxException, IOException{
		ClientJava clientJava = new ClientJava();
		
		clientJava.accrocherCapteur("capteur_IR");
		clientJava.accrocherCapteur("capteur_UV");
		clientJava.accrocherCapteur("capteur_distance");
		clientJava.accrocherCapteur("capteur_giroscope");
		clientJava.accrocherCapteur("capteur_gps");
		clientJava.accrocherCapteur("capteur_wifi");
		int x1 = 12;
		int x2 = 2;
		int x3 = 17;
		int x4 = 6;
		int x5 = 20;
		int x6 = 9;
		Date dateDeb;
		Date dateCourante;
		boolean fini;
		while(true){
			dateDeb = new Date();
			clientJava.envoieMessage("capteur_IR", Integer.toString((int) Math.max(0, x1+Math.random()*(-2)+1)));
			clientJava.envoieMessage("capteur_UV",  Integer.toString((int) Math.max(0, x2+Math.random()*(-2)+1)));
			clientJava.envoieMessage("capteur_distance",  Integer.toString((int) Math.max(0, x3+Math.random()*(-2)+1)));
			clientJava.envoieMessage("capteur_giroscope", Integer.toString((int) Math.max(0, x4+Math.random()*(-2)+1)));
			clientJava.envoieMessage("capteur_gps", Integer.toString((int) Math.max(0, x5+Math.random()*(-2)+1)));
			clientJava.envoieMessage("capteur_wifi", Integer.toString((int) Math.max(0, x6+Math.random()*(-2)+1)));
			fini = false;
			
			while(!fini){
				dateCourante = new Date();
				if(dateCourante.getSeconds()-dateDeb.getSeconds()>1){
					fini = true;
				}
			}
			//clientJava.fermerClient();
		}
	}
}