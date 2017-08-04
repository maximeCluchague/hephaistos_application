
all : Sensor_Data_Controler2 clear Start_Server Stop_Server Sensor_Data_Controler Create_New_Server Client ExecSensorClient

Start_Server : StartServer.c
	gcc -Wall StartServer.c -o StartServer

Stop_Server : StopServer.c
	gcc -Wall StopServer.c -o StopServer

clear : StartServer StopServer sensorDataControler client CreateNewServer execSensorClient
	rm StartServer
	rm StopServer
	rm sensorDataControler
	rm client
	rm CreateNewServer
	rm execSensorClient

Create_New_Server : CreateNewServer.c
	gcc -Wall CreateNewServer.c -o CreateNewServer

Client : client.c
	gcc -Wall client.c -o client
	
Sensor_Data_Controler : sensorDataControler.o 
	gcc -g -w -fpermissive  -I../ -I/usr/include    sensorDataControler.c  -o sensorDataControler  -lphidget21

Sensor_Data_Controler2 : sensorDataControler.o 
	gcc -g -w -fpermissive  -I../ -I/usr/include    sensorDataControler.c  -o sensorDataControler  -lphidget21

ExecSensorClient : execSensorClient.c
	gcc -Wall execSensorClient.c -o execSensorClient
