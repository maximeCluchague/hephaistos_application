I. Programme C Phidget 

	1)COMPILATION
		Compiler le programme C qui utlise les librairies Phidgets pour recupérer les Données capteurs
		$ : make activite_bis

	2) EXECUTION
		$ : ./activite_bis

II. Programme C Client Socket 

	1)COMPILATION
		Compiler le programme C qui utlise les librairies Phidgets pour recupérer les Données capteurs
		$ : gcc -Wall client.c -o client 

	2) EXECUTION
		Executer l'application java Serveur.java avant de lancer celle de clien.c PS : mettre les bons ports en entree
		$ : ./client <adresse> <port> <Json_message>
		ex : ./client localhost 5000 "{\"idCapteur\":\"capteur4\",\"acquisition\":\"20\",\"date\":\"12:23:21\"}"


