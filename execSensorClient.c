#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <pthread.h>

char *concat_string(char *s1,char *s2)
{
     char *s3=NULL;
     s3=(char *)malloc((strlen(s1)+strlen(s2))*sizeof(char));
     strcpy(s3,s1);
     strcat(s3,s2);
     return s3;
     }



int main(int argc,char *argv[]){
	if(argc<3){	
		printf("Erreur : Il manque des arguments\nUsage : ./execSensorClient <adresse du serveur> <port du serveur>");
	}else{
		char* arguments = concat_string(concat_string(argv[1]," "),argv[2]);
		char* commande = concat_string("xterm -geometry 50x20+50+50 -e java -jar clientJava.jar ",arguments);
		char* doublecommande = concat_string("xterm -geometry 50x20+390+50 -e ./sensorDataControler & ",commande);
		system(doublecommande);
	}
	
	return 0;
}



