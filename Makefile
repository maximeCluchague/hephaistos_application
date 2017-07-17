
all : clear Start_Server Stop_Server 

Start_Server : StartServer.c
	gcc -Wall StartServer.c -o StartServer

Stop_Server : StopServer.c
	gcc -Wall StopServer.c -o StopServer

clear : StartServer StopServer
	rm StartServer
	rm StopServer
