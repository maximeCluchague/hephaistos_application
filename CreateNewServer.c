#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc,char *argv[]){
	char input[1];

	char port[8];
	char nomDomain[32];
	char URLwar[128];
	char commande[100];

	printf("\n-----------------------------------------\n");
	printf("     CREATION DU SERVEUR HEPHAISTOS    \n");
	printf("-----------------------------------------\n");

	
	printf("\nVoulez-vous créer un nouveau serveur ? (y/n)\n");
	scanf("%s", input);
	
	// On veut creer un nouveau serveur
	if(input[0]=='y' || input[0]=='Y'){

		printf("\nVoulez-vous créer un nouveau domaine ? (y/n)\n");
		scanf("%s", input);

		// On veut creer un nouveau domaine
		if(input[0]=='y' || input[0]=='Y'){

			printf("\nChoisir un nom de domaine où sera déployé le serveur :\n> ");
			scanf("%s", nomDomain);
			
			printf("Définir le port Administrateur :\n> ");
			scanf("%s", port);

			// On creer un nouveau domaine
			sprintf(commande,"glassfish4/glassfish/bin/asadmin create-domain --adminport %s --profile developer --user admin %s",port,nomDomain);
			system(commande);
		}

		else{
			printf("\nVoulez-vous utiliser un domaine existant ? (y/n)\n");
			scanf("%s", input);

			// On veut démarrer un domain existant
			if(input[0]=='y' || input[0]=='Y'){
				printf("\nSelectionnez un domain existant parmis ceux disponible : \n");
				system("ls glassfish4/glassfish/domains");
				printf("> ");
				scanf("%s", nomDomain);
			}else{
				return 1;
			}
		}

		printf("\nVoulez-vous démarrer le Domaine ? (y/n)\n");
		scanf("%s", input);
		// On veut démarrer le domaine
		if(input[0]=='y' || input[0]=='Y'){
			sprintf(commande,"glassfish4/glassfish/bin/asadmin start-domain %s",nomDomain);
			system(commande);

			printf("\nVoulez-vous déployer un .war file ? (y/n)\n");
			scanf("%s", input);
			// On veut déployer un war file
			if(input[0]=='y' || input[0]=='Y'){
				printf("Entrer le chemin absolu du .war à déployer sur le serveur\n> ");
	scanf("%s", URLwar);
				sprintf(commande,"xterm -e glassfish4/glassfish/bin/asadmin deploy --port %s --host localhost %s",port,URLwar);
				system(commande);
			}else{
				return 1;
			}
		}
		else{
			return 1;
		}
	}
    	return 1;
}



