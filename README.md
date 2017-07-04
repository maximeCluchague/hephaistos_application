# hephaistos_application

I. Description/Contenu

	le dossier hephaistos_application du git est composé de : 

	Deux projects différents 
		- Dynamic WebProject 'hephaitos_project' : Serveur Java 
		- Java Project 'CTRL_sensor' : Client java (@ClientEndpoint)

	Un serveur glassfish 
		- 'glassfish4'

	un jar executable du Client java 
		- 'sendDataWebServer.jar' qui permet d'envoyer les données en ligne de commande via le terminal : 
		$ : java -jar sendDataWebServer.jar <idCapteur> <valeurAcquisition>
	
	la librairie jdk nécéssaire aux dynamic Web App de java EE 

	la documentation associé au projet

	l'executable 'oc' qui permet d'interagir avec la web console de Openshift (Potentiel hébergeurdu serveur ?)



II. Execution du project en Localhost port 8080

Tutoriel détaillé sur : https://dzone.com/articles/how-deploy-war-file-using

Pour faire fonctionner le tout en Localhost suivre les étapes suivantes :
	
	1) Mise en route du serveur : 
		a) Créer le fichier 'hephaistos_project.war' dans le dossier 'hephaitos_application': Ouvrir hephaistos_project dans eclipse > fichier > export > web > WAR file

		b) ouvrir un terminal dans hephaistos_application 
		$ : cd glassfish4/glassfish/
		$ : bin/asadmin

		c) créer le domaine : 
		$ : create-domain --adminport 4848 --profile developer --user admin <nom_domaine>

		d) Démarrer le domaine <nom_domaine> :
		$ : start-domain <nom_domaine>

		e) Déployer le fichier 'hephaistos_project.war' : 
		$ : deploy --port 4848 --host localhost /user/mcluchag/home/Desktop/hephaistos_application/hephaistos_project.war


		f) Pour Retirer le fichier :
		$ : undeploy --port 4848 --host localhost hephaistos_project (Sans le .war)

		g) Pour stoper le domain : 
		$ : stop-domain <nom_domaine>

	2) Envoi des données capteurs au serveur :

		a) Créer un executable 'sendDataServer.tar' dans le dossier 'hephaitos_application' : Ouvrir sensor_CTRL dans eclipse > fichier > export > java > TAR file

		b) Ouvrir un terminal dans le dossier 'hephaitos_application' et executer : 
			$ : $ : java -jar sendDataWebServer.jar <idCapteur> <valeurAcquisition>
			Role 
				- Envoie au serveur l'acquisition <valeurAcquisition> du capteur <idCapteur> sous forme de websocket 
			Arguments 
				- idCapteur = l'identifiant du capteur (entier > 0)
				- valeurAcquisition = la valeur que le capteur va renvoyé 

			cette commande pourra être appelé dans le code C# qui réceptionera les données capteurs à l'aide des commandes systèmes 

 
