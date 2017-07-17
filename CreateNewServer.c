#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc,char *argv[]){

	char port[8];
	char nomDomain[32];
	char adresse[32];

	printf("\n-----------------------------------------\n");
	printf("-----CREATION DE SERVEUR HEPHAISTOS------\n");
	printf("-----------------------------------------\n");
	printf("\n");
	printf("Définir un port Administrateur :\n> ");
	scanf("%s", port);
	printf("Choisir un nom de domaine où sera déployé le serveur :\n> ");
	scanf("%s", nomDomain);

	printf("Lancement de la procédure de création, suivre les instructions demandées\n");
	char commande[100];

	// CREATE-DOMAIN
	sprintf(commande,"glassfish4/glassfish/bin/asadmin create-domain --adminport %s --profile developer --user admin %s",port,nomDomain);
	system(commande);

	// START-DOMAIN 
	sprintf(commande,"glassfish4/glassfish/bin/asadmin start-domain %s",nomDomain);
	
	// UNDEPLOY WAR
	sprintf(commande,"glassfish4/glassfish/bin/asadmin undeploy --port %s --host localhost hephaistos_project",port);
	system(commande);

	// PWD
	long size;
	char *buf;
	char *URLwar;
 
	size = pathconf(".", _PC_PATH_MAX);
	if ((buf = (char *)malloc((size_t)size)) != NULL)
	{
    	URLwar = getcwd(buf, (size_t)size);
	}
	printf("\nURL : %s\n",URLwar);

	// DEPLOY WAR 
	sprintf(commande,"glassfish4/glassfish/bin/asadmin deploy --port %s --host localhost %s/Exec_App/hephaistos_project.war",port,URLwar);
	system(commande);

    return EXIT_SUCCESS;
}


