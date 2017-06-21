package com.za.websocket;

import javax.json.Json;
import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

public class SensorMessageEncoder implements Encoder.Text<SensorMessage>{

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void init(EndpointConfig arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String encode(SensorMessage message) throws EncodeException {
		return Json.createObjectBuilder().add("name",message.getName())
										 .add("message",message.getMessage())
										 .build().toString();
		
	}

}
