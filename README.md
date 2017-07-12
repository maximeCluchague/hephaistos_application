# hephaistos_application

<h1>I. Description/Contenu du projet</h1>

Le projet à pour but de visualiser des données capteur en temps réel sur une application Web / application android. 

	le dossier hephaistos_application du git est composé de : 

	Deux projects différents 
		- Dynamic WebProject 'hephaitos_project' : Serveur Java 
		- Java Project 'CTRL_sensor' : Client java (@ClientEndpoint)

	Un serveur glassfish 
		- 'glassfish4'

	un dossier comportant les fichier nécéssaire au lancement de l'application :
		- ExecApp
	
	la librairie jdk nécéssaire aux dynamic Web App de java EE 

	la documentation associée au projet

<h1>II. Récupérer le projet</h1>
Récupérer le contenu du projet via le terminal à l'aide de la commande
	
	$ : git clone https://github.com/maximeCluchague/hephaistos_application.git
	ou télécharger le zip associé à l'adresse : https://github.com/maximeCluchague/hephaistos_application.git

<h1>III. Lancement du Serveur</h1>

(Tutoriel détaillé sur : https://dzone.com/articles/how-deploy-war-file-usin)

<h2>A. Lancement de "asadmin tool"</h2>
Ouvrir un terminal dans le dossier hephaistos_application cloné/téléchargé et executer les commandes suivantes : 

	$ : cd glassfish4/glassfish/
	$ : bin/asadmin

le "asadmin tool" va alors se lancer dans le terminal.

<h2>B. Création du domaine </h2>

Dans le "asadmin tool" vous pouvez maintenant créer un nouveau domaine à l'aide de la commande suivante : 

	$ : create-domain --adminport <admin_port> --profile developer --user admin <nom_domaine>
	
		- <admin_port> est le port d'accès à l'administrateur du serveur (ex : 4848) ce port permettra de modifier les paramètres du serveur
		- <nom_domaine> est le nom de domaine que vous aller définir pour votre futur serveur (ex : domainTest) 

<h2>C. Démarrage du domaine </h2>

utiliser la ligne de commande suivante pour démarrer le domain <nom_domaine> créer précédemment : 

	$ : start-domain <nom_domaine>

pour arrêter un domaine il vous suffit d'executer la commande : 

	$ : stop-domain <nom_domaine>

<h2>D. Déploiement du serveur</h2>

Une fois le domaine créer et lancé il faut déployé le serveur. Le serveur est un fichier .WAR (un exécutable java). Le war du projet est disponible dans le dossier : .../hephaistos_application/ExecApp/

utiliser la commande suivante pour déployer le serveur : 

	$ : deploy --port <admin_port> --host <adresse> [PWD]/hephaistos_application/ExecApp/hephaistos_project.war
	- <admin_port> est le port d'accès à l'administrateur du serveur (ex : 4848) ce port permettra de modifier les paramètres du serveur.
	- <adresse> est l'adresse IP de la machine (ex: localhost, 138.96.192.120 ... )
	- ([PWD] est le chemin où se trouve le dossier hephaistos_application)

/!\ ATTENTION /!\ Il est impossible de déployer le serveur si celui-ci est déja déployé sur un autre domaine en cas d'érreur il faut undeploy le serveur à l'aide de la commande suivante : 

	$ : undeploy --port 4848 --host localhost hephaistos_project (Sans le .war)

PS : par défaut le serveur est sur le port 8080

<h2>E. Interface administrateur et modification des paramètres du serveur</h2>

Pour accèder à l'interface administrateur il vous suffit d'ouvrir un navigateur web et d'entrer l'URL : 

http://<adresse>/<admin_port> (ex: mon serveur tourne en localhost et le port de l'administrateur est 4848 il me suffit d'entrer l'adresse : http://localhost/4848 )

Une fois sur cette interface vous pouvez, par exemple, modifier le port 8080 qui est définie par défaut :

Configurations > Server-config > Network Config > http-listener-1

<h2>F. Vérification du bon fonctionnement du server</h2>

Si tout s'est bien passé vous pouvez alors ouvrir une page Web et y entrer l'URL suivant : 

	http://<adresseIP_du_Serveur>/<port>/hephaistos_application/index.html
	
	<adresseIP_du_Serveur> : si le serveur tourne sur votre machine vous pouvez taper localhost sinon vous entrer l'IP de la machine qui fait tourner le serveur
	<port> : le port de communication que vous avez défini pour le serveur (par défaut 8080)

Si vous pouvez ouvrir cette page Web depuis la machine qui fait tourner le serveur alors celui(ci fonctionne correctement, vous pouvez vérifier si celui-ci est accéssible depuis une machine distante en tapant cett même URL avec l'IP de la machine qui héberge le serveur en cas de problème vérifier si votre Fire Wall/Pare Feu ne bloc pas le port de communication de votre Serveur 

Il reste à vérifier si la liaison WebSocket est fonctionnel, pour se faire entrer dans le champs de la page Web 'adresse' l'adresse IP de la machine qui heberge le serveur et le port de communication (par défaut 8080) appuyer sur 'connexion'. Si la console affiche 
	[---> CONNEXION ETABLIE AVEC 'ws://localhost:8080/hephaistos_project/hephaistoswebserver']


Alors la communication avec votre serveur est fonctionnelle !! 


<h1>IV. Communication du Serveur</h1>

Le serveur échange des données à l'aide de WebSocket qui permettent une communication bilatéral contrairement au protocol HTTP. Que ce soit en java ou en java script les clients/serveur utilisent les même méthodes pour communiquer entre eux :

	-OnOpen : Détecte une connexion
	-OnClose : Détecte une déconnexion
	-OnMessage : Détecte les message entrant
	-OnError : Détecte les erreurs

Les message envoyé par le serveur dans le cadre de cette application suivent le format JSON, les données sont structuré de la manière suivante : 
{"idCapteur","acquisition","date","commande"}

- idCapteur : le champs idCapteur contient l'identifiant du capteur sous forme de chaine de caractère (ex : capteur_IR)
- acquisition : le champs acquisition contient les données d'acquisition du capteur que ce soit une valeur entière (sous forme de String) ou un JSON si jamais il est nécessaire de transmettre plusieurs données (ex : vitesse, accélération, distance ... )
- date : la date de l'acquisition
- commande : une commande (qui est associé ou pas à un capteur) qui peut être envoyer puis exécuter par le serveur (ex : suprimmerCapteur, consulterCapteur, afficherCapteur ... etc)

<h1>V. Modification du code source du Serveur/Clients</h1>

Pour modifier le Serveur, ouvrir le projet java 'hephaistos_project' dans Eclipse java EE. Le code source du seveur se situe dans 'java Ressource/src/com.za.websocket/' il s'agit de la classe HephaistosWebServer.java. 

Les classes SensorMessage.java, SensorMessageDecoder.java et SensorMessageEncoder.java sont les classes qui permettent d'encoder/de décoder les message arrivant/partant du serveur. 

Pour modifier les clients aller dans le projet hephaistos_project dans le dossier /WebContent, celui-ci contient toute les page html du serveur

Une fois toutes ces modifications éffectué il vous faut générer le nouveaux .WAR du serveur. Pour ce faire :

	Ouvrir hephaistos_project dans eclipse > fichier > export > web > WAR file

ATTENTION  : Enregistrer le WAR dans le dossier ExecApp et mettant le nom 'hephaistos_project.war'

une fois le .WAR générer il est possible deployer le serveur à l'aide de la méthode défini dans la partie III.

Il est également possbile de modifier le code source du client java en ouvrant le projet CTRL_sensors dans eclipse java EE. 
une fois les modifications éffectuées générer le .jar du projet prêt à l'execution  :
	Ouvrir sensor_CTRL dans eclipse > fichier > export > java > TAR file

<h1>VI. Lancement du client écoutant les capteurs sur le Phidget</h1>

<h2>A. Prérequis </h2>

- Vérifier que la librairie Phidget en C est bien installé sur la machine qui servira de transmettre les données vers le serveur. 

- Connecter le Phidget possédant les capteurs sur cette même machine 

<h2>B. Executer le Client Java</h2>

Il faut tout d'abord exécuter le client java, il s'agit d'un programme qui tourne en boucle et qui va transmettre des message vers le serveur en ouvrant un webSocket.

ouvrir un terminal dans le dossier hephaistos_application et exécuter :

	$ : cd ExecApp	
	$ : java -jar clientJava.jar <adresseIPServer> <port>

<adresseIPServer> l'adresse ip de la machine où est hébergé le serveur (ex: localhost, 138.96.192.120 ... )
<port> Port de communcation du serveur (ex : 8080)

Si vous voyez apparaître 

	[->] Ouverture du client 3aa6c8e7-d854-47c1-903f-8ab2d1a49296
	[<-] [CONNEXION] ws://localhost:8080/hephaistos_project/hephaistoswebserver

sur le terminal alors votre Client java est prêt à communiquer avec le Serveur ne l'arrêtez pas !

<h2>C. Execution du Listener</h2>

Il reste plus qu'à lancer le programme C qui va récupérer les données des capteur en utilisant les librairies Phidget. A chaque fois qu'un événement capteur se produit une procédure est déclenchée dans ce programme C. Cette procédure va alors ouvrir un Socket vers le client java pour lui transmettre ces événements qui pourront, par la suite, être envoyés vers le Serveur ! 
Pour se faire : Ouvrir un nouveaux terminal et exécuter les lignes des commandes suivantes :

	$ : gcc -Wall client.c -o client	
	$ : make activite_bis
	$ : ./activite_bis

Voilà ! Passez votre main devant un capteur connecté au Phidget vous devriez voir sur le terminal qui fait tourner le ClientJava des message transmis vers le Serveur ! 

