package com.za.websocket;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class testClientJava {
	public static class SimulationCapteur {
		  Timer t;
		  ClientJava clientJava;
		  static int messagePrec[] = {-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,};
		  
		  public SimulationCapteur(ClientJava client) {
			 this.clientJava = client;
			 
		    t = new Timer();
		    t.schedule(new MonAction(), 0, 1*500);
		    }

		  class MonAction extends TimerTask {
		    int nbrRepetitions = 10000;

		    public void run() {
		      if (nbrRepetitions > 0) {
		    	  try {
		    		for(int i=0;i<messagePrec.length;i++){
		    			int alea = doubleToInt(Math.random());
		    			if(messagePrec[i]!=alea){
		    				messagePrec[i]=alea;
		    				clientJava.envoieMessage("Sensor_"+(i+1), Integer.toString(alea));
		    			}
		    		}
		    	  } catch (UnknownHostException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
		        nbrRepetitions--;
		      } else {
		        System.out.println("Terminé!");
		        t.cancel();
		        }
		      }
		    }
		  } 
	public static int doubleToInt(double d){
		if(d>0.90){
			return 1;
		}
		return 0;
	}
	
	public static void main(String[] args) throws URISyntaxException, IOException{
		ClientJava clientJava = new ClientJava();
		SimulationCapteur simulation = new SimulationCapteur(clientJava);
	}
}
