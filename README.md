# hephaistos_application

<h1>I. Présentation du projet</h1>

<h2> A. Présentation du projet hephaistos </h2>

Le projet de l'équipe Hephaistos de l'INRIA de Sophia-Antipolis à pour but d'étudier les déplacements de personnes agées de façon anonymes et non-intrusives au sein d'une infrastructure de soin (Institut Claude Pompidou). Les données relatives à ces flux de déplacements sont récupérés par des capteurs IR (Infrarouge) installés au sein de cette infrastructure. Ceux-ci permettront de mieux comprendre le comportement de ces personnes dans une telle infrastructure pour adapter l'environement aux observations, d'établir des modèles statistique...etc.



<h2>B. Présentation de mon projet </h2>

Actuellement le traitement de ces données se fait par des programmes C++ embarqués sur les cartes Phidgets connectés aux capteurs. Ces programmes analysent, interpretent et enregistrent ces données capteurs sur des fichiers log. Cependant cette architecture pose un certains nombre de problèmes comme la limitation en terme de puissance de calcul, et de mémoire pour le stockage de donnée. 

Ainsi mon projet avait pour but de développer une architecture Client/Serveur qui permet de pallier à ces différents problèmes tout en permettant d'avoir une visualisation en temps réel sur une application Web/ Android du nombre de personne dans l'Institut Pompidou. En effet une telle architecture permettrait de déployer la puissance de calcul afin d'optimiser le traitement de ces données sur un ou plusieurs clients connectés à ce serveur. Ou encore d'avoir un client en écoute sur le serveur qui récupère ces données en les enregistrant sur des fichier log, des fichier structuré (xml,json..etc) ou des base de données (MySQL). Ainsi les programme embraqués sur les cartes Phidget de l'Institut Claude Pompidou n'aurai plus qu'une seul tâche à effectué : l'envoi des données vers le serveur. Cependant cette architecture n'est pas idéale car elle à besoin d'une connexion internet permanante pour transmettre les données vers le serveur et cela peut poser des problèmes en terme de sécurité sur la transmission de données qui peuvent être interceptée. 

<h1>II. Technologies utilisées </h1>

<h2>A. Client-Serveur</h2>

Le serveur utilisé dans ce projet est un serveur Java Glassfish 4.0, Open source sur java EE 7. Il y a différents client, dans des langages différent en fonction de leur rôle : 
	- Un client javaScript pour l'application Web qui permet la visualisation en temps réel des données.
	- Un client Java qui est simulateur de capteurs 
	- Un client Java qui récupère les données et les stocke écrit sur un fichier en local
	- Un client Java/C qui transmet les données des capteurs connectés au Phidget vers le Serveur.

<h2>B. Protocol de communication</h2>

Le serveur échange des données à l'aide de WebSocket, qui utilisent un canal de communication full-duplex sur un socket TCP. Cette communication bilatéralle, contrairement au protocol HTTP, permet la notification au client d'un changement d'état du serveur ainsi que l'envoi de données (Push) du serveur vers le client (sans que ce dernier ait à effectuer une requête). De plus les WebSocket sont compatible avec presque tout les langages (C,C++,C#, Python, Java, JavaScript) et s'appuient sur des méthodes suivant une norme commune : 

	-OnOpen : Détecte une connexion
	-OnClose : Détecte une déconnexion
	-OnMessage : Détecte un message entrant
	-OnError : Détecte les erreurs

<h2>C. Structure des message</h2>

Les messages envoyés par le serveur dans le cadre de cette application utilisent le format structuré JSON, les données sont organisé de la manière suivante : 
{"idCapteur","acquisition","date","commande"}

- idCapteur : le champs idCapteur contient l'identifiant du capteur sous forme de chaine de caractère (ex : capteur_IR)
- acquisition : le champs acquisition contient les données d'acquisitions du capteur que ce soit une valeur de type INT ou FLOAT simple ou un JSON si jamais il est nécessaire de transmettre plusieurs données (ex : vitesse, accélération, distance ... )
- date : la date de l'acquisition sur forme de chaine de caractère
- commande : une commande (qui est associé ou pas à un capteur) qui peut être envoyer puis exécuter par le serveur (ex : suprimmerCapteur, consulterCapteur, afficherCapteur ... etc)

<h1>III. Récupérer le projet</h1>

Le projet est disponible sur Github à l'adresse 'https://github.com/maximeCluchague/hephaistos_application.git'. 

Pour le Récupérer vous pouvez télécharger le zip sur cette adresse puis en allant sur : Clone or download > Download ZIP. Puis dézipper le fichier !

De plus, il vous est possible de cloner le projet en local sur votre machine. Cela va vous permettre de le mettre à jour en cas de changement sur Github ou alors de le modifier avec de simples commandes. Pour cloner le projet en local sur votre machine déplacez-vous dans le futur répertoire parent de votre projet en ouvrant un terminal puis en exécutant la commande jusqu'à arriver dans le dossier souhaité:
	
	$ : cd <nom_du_dossier>

Enfin, pour cloner le projet ce dossier parent exécuter la commande suivante dans ce même terminal :
	
	$ : git clone https://github.com/maximeCluchague/hephaistos_application.git


<h1>IV. Lancement automatique du Serveur</h1>

Un domaine est créer par défaut il s'agit de hephaistosDomain dont le port administrateur est 5000. 
Celui-ci se situe dans le dossier glassfish4/glassfish/domains, et il contient un .WAR du projet.

1. Lancer le Serveur :

		$ : ./StartServer

2. Stopper le Serveur :

		$ : ./StopServer

PS : un makefile est disponible pour compiler les fichier StartServer.c et StopServer.c

<h1>V. Lancement manuel du Serveur</h1>

(Tutoriel détaillé sur : https://dzone.com/articles/how-deploy-war-file-usin)

<h2>A. Lancement de "asadmin tool"</h2>
Ouvrir un terminal dans le dossier hephaistos_application cloné/téléchargé et executer les commandes suivantes : 

	$ : ./glassfish4/glassfish/bin/asadmin

le "asadmin tool" va alors être lancé dans le terminal.

<h2>B. Création du domaine </h2>

Dans le "asadmin tool" vous pouvez maintenant créer un nouveau domaine à l'aide de la commande suivante : 

	$ : create-domain --adminport <admin_port> --profile developer --user admin <nom_domaine>
	
- <admin_port> est le port d'accès de l'administrateur du serveur (ex : 4848) ce port permettra de modifier les paramètres du serveur
- <nom_domaine> est le nom de domaine que vous allez définir pour votre futur serveur (ex : domainTest) 

<h2>C. Démarrage du domaine </h2>

Utiliser la ligne de commande suivante pour démarrer le domaine <nom_domaine> créer précédemment : 

	$ : start-domain <nom_domaine>

Pour arrêter un domaine il vous suffit d'executer la commande : 

	$ : stop-domain <nom_domaine>

<h2>D. Déploiement du serveur</h2>

Une fois le domaine créer et lancé il faut déployer le serveur. Le serveur est un fichier .WAR (un exécutable java). Le .WAR du projet est disponible dans le dossier : .../hephaistos_application/Exec_App/

utiliser la commande suivante pour déployer le serveur : 

	$ : deploy --port <admin_port> --host <adresse> [PWD]/hephaistos_application/Exec_App/hephaistos_project.war
	- <admin_port> est le port d'accès à l'administrateur du serveur (ex : 4848) ce port permettra de modifier les paramètres du serveur.
	- <adresse> est l'adresse IP de la machine (ex: localhost, 138.96.192.120 ... )
	- ([PWD] est le chemin où se trouve le dossier hephaistos_application)

**ATTENTION :** Il est impossible de déployer le serveur si celui-ci est déja déployé sur un autre domaine en cas d'erreur il faut undeploy le serveur à l'aide de la commande suivante : 

	$ : undeploy --port 4848 --host localhost hephaistos_project (Sans le .war)

PS : Par défaut le serveur est sur le port 8080

<h2>E. Interface administrateur et modification des paramètres du serveur</h2>

Pour accèder à l'interface administrateur il vous suffit d'ouvrir un navigateur web et d'entrer l'URL : 

http://<adresse>/<admin_port> (ex: Le serveur tourne en localhost et le port de l'administrateur est 4848 il me suffit d'entrer l'adresse : http://localhost/4848 )

Une fois sur cette interface chargée vous pouvez, par exemple, modifier le port 8080 qui est définie par défaut :

Configurations > Server-config > Network Config > http-listener-1

<h2>F. Test/Vérification du server</h2>

Si tout s'est bien passé vous pouvez alors ouvrir une page Web et y entrer l'URL suivant : 

	http://<adresseIP_du_Serveur>/<port>/hephaistos_application/index.html
	
- <adresseIP_du_Serveur> : si le serveur tourne sur votre machine vous pouvez taper localhost sinon vous entrez l'IP de la machine heberge le serveur

- <port> : le port de communication que vous avez défini pour le serveur (par défaut 8080)

Si vous pouvez ouvrir cette page Web depuis la machine qui fait tourner le serveur alors celui-ci fonctionne correctement. Vous pouvez vérifier si celui-ci est accéssible depuis une machine distante en tapant cette même URL avec l'IP de la machine qui héberge le serveur en cas de problème vérifiez si votre Fire Wall/Pare Feu ne bloc pas le port de communication de votre Serveur 

Il ne reste plus qu'à vérifier si la liaison WebSocket est fonctionnelle ! Pour se faire entrer dans le champs de saisie de la page Web 'adresse' l'adresse IP de la machine qui heberge le serveur et le port de communication (par défaut 8080) appuyer sur 'connexion'. Si la console affiche 
	[---> CONNEXION ETABLIE AVEC 'ws://localhost:8080/hephaistos_project/hephaistoswebserver']


Alors la communication avec votre serveur est fonctionnelle ! 


<h1>VI. Modification du code source du Serveur/Clients</h1>

Pour modifier le Serveur, ouvrir le projet java 'hephaistos_project' dans Eclipse java EE. Le code source du seveur se situe dans 'java Ressource/src/com.za.websocket/' il s'agit de la classe HephaistosWebServer.java. 

Les classes SensorMessage.java, SensorMessageDecoder.java et SensorMessageEncoder.java sont les classes qui permettent d'encoder/décoder les message arrivant/partant du serveur. 

Pour modifier les clients aller dans le projet hephaistos_project dans le dossier /WebContent, celui-ci contient toute les pages html du serveur.

Une fois toutes ces modifications éffectuées il vous faut générer le nouveaux .WAR du serveur. Pour se faire :

	Ouvrir hephaistos_project dans eclipse > fichier > export > web > WAR file

**ATTENTION :** Enregistrer le WAR dans le dossier Exec_App et mettant le nom 'hephaistos_project.war'

une fois le .WAR générer il est possible de deployer le serveur à l'aide de la méthode définie dans la partie III.

Il est également possbile de modifier le code source du client java en ouvrant le projet CTRL_sensors dans eclipse java EE. 
une fois les modifications éffectuées, générer le .jar du projet prêt à l'execution  :

	Ouvrir sensor_CTRL dans eclipse > fichier > export > java > TAR file

<h1>VII. Lancement du client écoutant les capteurs sur le Phidget</h1>

<h2>A. Prérequis </h2>

- Vérifier que la librairie Phidget en C est bien installée sur la machine qui servira à transmettre les données vers le serveur. 

- Connecter le Phidget possédant les capteurs sur cette même machine 

<h2>B. Executer le Client Java</h2>

Il faut tout d'abord exécuter le client java, il s'agit d'un programme qui tourne en boucle et qui va transmettre des messages vers le serveur en ouvrant un webSocket.

ouvrir un terminal dans le dossier hephaistos_application et exécuter :

	$ : cd Exec_App	
	$ : java -jar clientJava.jar <adresseIPServer> <port>

<adresseIPServer> l'adresse ip de la machine où est hébergé le serveur (ex: localhost, 138.96.192.120 ... )
<port> Port de communcation du serveur (ex : 8080)

Si vous voyez apparaître 

	[->] Ouverture du client 3aa6c8e7-d854-47c1-903f-8ab2d1a49296
	[<-] [CONNEXION] ws://localhost:8080/hephaistos_project/hephaistoswebserver

sur le terminal alors votre Client java est prêt à communiquer avec le Serveur ne l'arrêtez pas !

<h2>C. Execution du Listener</h2>

Il ne reste plus qu'à lancer le programme C qui va récupérer les données des capteurs en utilisant les librairies Phidget. A chaque fois qu'un événement capteur se produit une procédure est déclenchée dans ce programme C. Cette procédure va alors ouvrir un Socket vers le client java pour lui transmettre ces événements qui pourront, par la suite, être envoyés vers le Serveur ! 
Pour se faire : Ouvrir un nouveau terminal et exécuter les lignes des commandes suivantes :

	$ : gcc -Wall client.c -o client	
	$ : make activite_bis
	$ : ./activite_bis

Voilà ! Passez votre main devant un capteur connecté au Phidget vous devriez voir sur le terminal du ClientJava des messages transmis vers le Serveur ! 

