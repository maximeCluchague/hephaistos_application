# hephaistos_application

<h1>1. Présentation du projet</h1>

<h2>1.1. Présentation du contexte </h2>

L'équipe Hephaistos de l'INRIA de Sophia-Antipolis travaille actuellement sur un projet qui a pour but d'étudier le déplacement de personnes âgées vus comme des individus non indentifiables  au sein de l’infrastructure de soin, l’Institut Claude Pompidou. Ce projet est développé en collaboration avec les équipes de médecines de cet institut. Il doit permettre aux équipes médicales sur place de mieux comprendre le comportement de ces personnes dans une telle infrastructure en établissant des modèles statistiques afin d’adapter l’environnement aux observations. Pour établir de tels modèles, l’équipe récupère les données relatives à ces flux de déplacements via des capteurs Infrarouges de proximité installés au sein de cette infrastructure. 

<h2>1.2. Description et analyse du problème</h2>
Actuellement le traitement de ces données se fait par des programmes C embarqués sur les cartes Phidgets connectées aux capteurs. Ces programmes analysent, interprètent et enregistrent ces données capteurs sur des fichiers log journaliers. Cependant cette architecture pose un certain nombre de problèmes comme la limitation en terme de puissance de calcul et la limitation de mémoire pour le stockage des données. De plus l’équipe ne dispose d’aucune interface permettant de visualiser l’état de ces dispositifs en temps réel. Mon projet a pour but de développer une architecture qui permettrait, d’une part, de pallier à ces différents problèmes et d’autre part d’implémenter un ou plusieurs prototypes d’interfaces (si la durée du stage le permet) permettant la visualisation en temps réel de l’état de ces différents dispositifs robotiques. Parmi les prototypes demandés : une visualisation en temps réel du nombre de personnes présentes dans chacune des pièces au sein de l'Institut Claude Pompidou.

<h2>1.3. Cahier des charges </h2>

Le but de mon projet est de développer un ou plusieurs prototypes d’application interfaçant différents capteurs et actionneurs existants. Ces applications doivent être accessibles depuis un écran tactile de 65’’ muni d’un cœur Android dont dispose l’équipe Hephaistos et, si possible, depuis n’importe quel machine (Linux, Mac OS, Windows, Android, IOS, Windows Phone...). Un de ces prototypes d’interface demandé est une visualisation en temps réel de dispositifs robotiques d’assistance aux personnes fragiles. Ce prototype doit de plus afficher le nombre de personnes présentes au sein d’un institut de soin (dans le cadre du projet Hephaistos il s’agit de l’Institut Claude Pompidou) où un réseau de capteurs de proximité est déployé sur place. Dans un premier temps il est donc nécessaire de développer une architecture qui permettra par la suite de développer ces différents prototypes d'interfaces. Celle-ci doit permettre la transmission des données de ces différents dispositifs robotiques vers ces applications. Ces échanges de messages doivent s’effectuer à distance et en temps réel. D’où la nécessité d’utiliser une architecture de type Client-Serveur permettant la transmission de données à distance sur le réseau internet. Par ailleurs, il m’est demandé d’utiliser la technologie WebSocket pour que les échanges s’effectuent en temps réel et de façon bilatérale entre les clients (les dispositifs robotiques ou l’utilisateur de l’application) et le serveur. Cette architecture doit donc être compatible avec n’importe quel type de dispositif robotique et n’importe quel prototype d’application de visualisation de ces dispositifs pour que, par la suite, de nouveaux prototypes d’interface puissent être développés. 

<h1>2. Réalisation et implémentation du produit </h1>

<h2>2.1. L’architecture développée</h2>

<h3>2.1.1. Présentation de l'architecture</h3>

Le projet s’appuie sur une architecture de type client-serveur. Cela désigne un mode de communication à travers un réseau (wifi local, local, internet, localhost ...etc) entre plusieurs programmes. Un programme, appelé programme client, envoie une requête à un autre programme appelé serveur qui répond à ces requêtes. Cela permet à différent programmes de communiquer entre eux à distance. Cependant, contrairement à une architecture client-serveur classique, celle développée dans le cadre de ce projet utilise un mode de communication par WebSocket ce qui permet des échanges bilatéraux entre clients et serveur  (voir partie 3.3.3. pour plus de précisions sur le protocole de communication). Ici, l’architecture de ce projet est composée d’un serveur central et de quatre Clients indépendants :

- Un serveur GlassFish 4.0 développé en Java qui va permettre de communiquer avec l’ensemble des clients, ou servir d’intermédiaire à plusieurs d’entre-eux afin qu’ils échangent des informations et/ou des données. Lorsque le serveur reçoit des données capteurs il les transfère à tous les Clients qui sont connectés avec celui-ci, y compris au client émetteur. Ce serveur peut-être hébergé sur n’importe quel machine disposant d’une connexion internet et dont le Pare-feu du routeur associé à cette connexion autorise le port de communication du serveur (par défaut 8080 pour les WebSockets). Le serveur ainsi développé pourrait également être déployé sur un service d’hébergement en ligne.

- Une machine cliente disposant d’une connexion internet (Rasberry Pi, Fit Pc ou ordinateur) et d’une carte Phidget (branchée sur un port USB) sur laquelle sont connectés les capteurs. Cette machine héberge deux programmes qui communiquent par Socket : 
* Un premier programme, écrit en C tourne en boucle infinie. Il va permettre d’effectuer un premier traitement sur les données acquises, gérer les événements capteurs, interagir avec eux, etc. Ce programme utilise la librairie Phidget pour être sensible aux changements d’état des capteurs, et construit le JSON du message qui va être transmis à un second programme par liaison Socket. 
* Ce second programme est un Client écrit en Java et tourne en boucle infinie. Il possède une liaison WebSocket ouverte en permanence avec le serveur. Il a pour rôle de transmettre les données capteurs au Serveur GlassFish à chaque fois qu’il reçoit un message JSON en provenance du programme C (premier programme).

A noter que cette machine doit être reliée aux cartes Phidgets présentes au sein de l’Infrastructure désirée (en l’occurrence l’ICP dans le cadre de ce projet). Elle doit donc être physiquement située aux abords immédiats de l’institut.

- L’application Web, un Client qui est à l’écoute du serveur lorsque l’utilisateur décide d’ouvrir le lien WebSocket. Cette application permet à l’utilisateur de visualiser, analyser et interpréter en temps réel les données capteurs (La description détaillée et complète des fonctionnalité de l’application est donnée  dans la partie 3.3.). Ce client peut-être lancé depuis n’importe quelle machine à partir de l’adresse internet de l’application, dès lors que le serveur est déployé. Ainsi, plusieurs utilisateurs venant de différentes machines peuvent lancer ce client simultanément, et un utilisateur peut lancer plusieurs fois ce même client sur une même machine. 

- Un programme client en boucle infinie qui interagit avec une base de donnée. Ce programme est à l’écoute permanente du serveur grâce à une liaison WebSocket avec celui-ci. Il récupère les données émises depuis le serveur, et les ajoute à une base de données (fichier log, csv, MySQL, json, xml... etc). A noter que ce client peut-être lancé de n’importe qu’elle machine (distante ou pas) du serveur. 

- Un Client qui joue le rôle de Simulateur de capteurs afin de pouvoir travailler en amont sur le développement de l’application et le développement des algorithmes d’analyse des flux générés par les capteurs activés... Ce Client est un programme Java qui transmet aléatoirement les données de 12 capteurs fictifs pendant un temps donné.

<h3> 2.1.2. Récupération du projet</h3>

Le projet est disponible sur la plateforme GitHub d’hébergement et de gestion de projets à l’adresse : 'https://github.com/maximeCluchague/hephaistos_application.git'. Pour le récupérer, télécharger le zip à cette même adresse, puis sélectionner : ‘Clone or download’ > ‘Download ZIP’. Enfin dézipper l’archive sur votre machine. Il est possible de cloner le projet en local sur n’importe quelle machine. Cela permet à l’utilisateur de disposer de la dernière version du projet en cas de mise à jour de celui-ci sur Github, et ce, à l’aide de commandes simples. De plus, si l’utilisateur est un contributeur du projet, celui-ci pourra effectuer des modifications et les enregistrer sur GitHub. Pour cloner le projet en local sur votre machine déplacez-vous à travers un terminal dans le futur répertoire racine de votre projet (à l'aide de la commande cd) puis exécuter la commande :

	$ : git clone https://github.com/maximeCluchague/hephaistos_application.git

Remarque : La documentation du projet est disponible dans le fichier README.md  dans le dossier du projet « hephaistos_application » et est directement visible à l’adresse du Git du projet.

<h3>2.1.3. Démarrage du serveur</h3>

a) Lancement automatique du serveur

Afin de simplifier au maximum le déploiement de l’architecture à travers le lancement du serveur, une procédure automatique de lancement du serveur a été développée. Elle utilise notamment la fonctionnalité « autodeploy » du serveur GlassFish. Cette procédure automatique utilise le domaine « hephaistosDomain »créé par défaut, dont le port administrateur est 5000 et l'adresse est « localhost ». Celui-ci se situe dans le dossier ‘glassfish4/glassfish/domains’. Un .war du projet est situé dans ‘glassfish4/glassfish/domains/hephaistosDomain/autodeploy’ . Tout d’abord, il faut commencer par compiler les fichiers C qui vont permettre la création du domaine, son démarrage et le déploiement de ce fichier .war. Un makefile est disponible pour effectuer ces taches de compilation. Pour l’exécuter, ouvrir un terminal, se déplacer dans le dossier du projet « hephaistos_application »  (à l'aide de la commande cd) puis exécuter la commande suivante :
	
	$ : make

Enfin, pour démarrer le Serveur, exécuter dans ce même terminal

	$ : ./StartServer

Et, pour arrêter le Serveur :

	$ : ./StopServer

b) Lancement manuel du serveur

- Création du domaine 
Commencer par ouvrir un terminal dans le dossier « hephaistos_application » du projet et exécuter les commandes suivantes : 

	$ : ./glassfish4/glassfish/bin/asadmin

le "asadmin tool" va alors être lancé dans le terminal. vous pouvez quitter "asadmin tool" à tout moment en tapant "exit".

	$ : create-domain --adminport <admin_port> --profile developer --user admin <nom_domaine>

<admin_port> est le port d'accès de l'administrateur du serveur (ex : 4848) ce port permettra à l’administrateur de modifier les paramètres du serveur 
<nom_domaine> est le nom de domaine que vous allez définir pour votre futur serveur (ex : domainTest) 

- Démarrage et arrêt du domaine 
Utiliser la ligne de commande suivante pour démarrer le domaine <nom_domaine> créé précédemment :

	$ : start-domain <nom_domaine>

Pour arrêter un domaine il vous suffit d’exécuter la commande :

	$ : stop-domain <nom_domaine>

- Déploiement du serveur

Une fois le domaine créé et lancé il faut déployer le serveur. Le serveur est un fichier .war 	(un exécutable java pour les serveurs). Le .war du projet est disponible dans le dossier du 	projet. Avant de déployer le .war s’assurer qu’un domaine est démarré. Enfin pour déployer 	le serveur, exécuter la commande :

	$ : deploy --port <admin_port> --host <adresse> <PATHwar>

<admin_port> est le port d'accès à l'administrateur du serveur (ex : 4848) ce port permettra de modifier les paramètres du serveur. Il s’agit du même port administrateur que celui utilisé pour le domaine.
<adresse> est l'adresse IP de la machine (ex: localhost, 138.96.192.120 ... ).
<PATHwar> est le chemin absolu du fichier .war

ATTENTION : Il est impossible de déployer le serveur si celui-ci est déjà déployé sur un 	autre domaine. En cas d'erreur il faut arrêter le serveur à l'aide de la commande suivante :

	$ : undeploy --port 4848 --host localhost <nom_du_war>

<nom_du_war> est le nom du war déployé (sans le .war).

<h3>2.1.4. Lancement du client gestionnaire des capteurs</h3>

Avant toute chose :
- Vérifier que la librairie Phidget en C est bien installée sur la machine cliente qui servira à transmettre les données capteurs vers le serveur.
- Connecter le Phidget possédant les capteurs sur cette machine par port USB.

Commencer tout d’abord par générer l’ensemble des exécutables sur votre machine, pour ce faire ouvrir un terminal dans le dossier du projet « hephaistos_application » et éxecuter la commande :

	$ : make

Enfin dans ce même terminal, lancer le script qui va lancer deux terminaux externes correspondant respectivement au programme C qui récupère les événements du Phidget et au client Java qui transmet les données vers le serveur. Pour ce faire, exécuter la commande :

	$ : ./execSensorClient <adresse> <port>

<adresse> est l’adresse IP de la machine hébergeant le serveur (ou bien si un service d’hébergement en ligne est utilisé,  le nom de domaine donné par celui-ci).
<port> est le port de communication utilisé par le serveur (par défaut 8080). 

<h3>2.1.5. Modification et maintenance du projet</h3>

Interface administrateur et modification des paramètres du serveur
	Pour accéder à l'interface administrateur, il vous suffit d'ouvrir un navigateur web et d'entrer l'url : http:///<admin_port> (ex: Le serveur tourne en localhost et le port de l'administrateur est 4848 il suffit d'entrer l'adresse : http://localhost/4848). Une fois l’interface chargée il est possible, par exemple, de modifier le port 8080 de communication du serveur, qui est défini par défaut :

	Configurations > Server-config > Network Config > http-listener-1

Modification du code source du projet

Pour modifier le Serveur, ouvrir le projet web dynamique 'hephaistos_project' dans Eclipse java EE. Le code source du serveur se situe dans la classe « HephaistosWebServer.java » du package « java Ressource/src/com.za.websocket/ ». Les classes « SensorMessage.java », « SensorMessageDecoder.java » et « SensorMessageEncoder.java » sont les classes qui permettent d'encoder et de décoder les messages reçus et émis par le serveur. Pour modifier l’application Web, ouvrir le projet « hephaistos_project » dans Eclipse java EE et se diriger dans le dossier « WebContent ». Celui-ci contient l’ensemble des pages html de l’application. De plus, les fichiers JavaScript associés se situent dans le dossier « WebContent/js » et les fichier CSS dans le dossier « WebContent/css » pour la mise en forme de l’application. Une fois toutes les modifications effectuées sur le projet il faut générer le nouveaux .war du serveur pourra alors être déployé sur un domaine existant. Pour ce faire, ouvrir le projet « hephaistos_project » dans eclipse puis aller dans : 
	
	fichier > export > web > WAR file. 

Enregistrer le .war dans le dossier souhaité. 
Pour déployer le .war généré de façon manuelle suivre la méthode décrite dans la partie 3.1.3,  b). Pour le déployer de  façon  automatique, copier ce nouveau .war du projet généré dans le dossier « hephaistos_application/glassfish4/glassfish/domains/hephaistosDomain/autodeploy »
Enfin, suivre la méthode décrite dans la partie 3.1.3,  a) pour déployer le serveur automatiquement.

<h2>2.2. Technologies utilisées</h2>

<h3>2.2.1. Environnement de développement et matériel utilisé</h3>

Le projet a été développé sur une machine utilisant la distribution Fedora du système d’exploitation Linux. Des capteurs de proximité binaires, une carte Phidget, une Fit-Pc ainsi qu’un Rasberry Pi ont été utilisés pour effectuer des tests et vérifier le bon fonctionnement de l’application. Le produit a été développé sous l’IDE Eclipse java EE 7, qui est utilisée notamment pour des application de type « Dynamic Web Application » (application web dynamique). Firefox a été le navigateur Web qui a permis de tester et valider l’application web. 

<h3>2.2.3. Langages de programmation</h3>

Java
* Le serveur a été développé en java. Il s’agit d’un serveur Glassfish 4.0 qui permet notamment l’utilisation de WebSocket(s) pour les communications. Le langage orienté objet a permis de structurer et d’organiser l’implémentation du serveur, notamment à travers les encodeurs et décodeurs de messages. 
* Le simulateur de capteur a également été développé en Java.
* Le client local qui écoute les messages entrants pour stocker les messages émis par le serveur sur une base de données a été écrit en java.
 C 
* Le programme qui récupère les données brutes des capteurs connectés au Phidget et les transmet au Client java par socket. 

 Html-CSS-JavaScript 
* Html a été utilisé pour créer les éléments présents sur la page web : images, texte, boutons...
* CSS a été utilisé pour le design, le positionnement des éléments, les animations et l’esthétique de l’application Web.
* JavaScript a été utilisé pour gérer la partie applicative et fonctionnelle de l’application Web 

 Shell 
* Pour la gestion du projet avec Git  (commit, pull, push, status...)
* Pour compiler des programmes C et exécuter les scripts
* Pour lancer le serveur manuellement dans le terminal
* Pour construire le Makefile du projet


















* <admin_port> est le port d'accès de l'administrateur du serveur (ex : 4848) ce port permettra à l’administrateur de modifier les paramètres du serveur 

* <nom_domaine> est le nom de domaine que vous allez définir pour votre futur serveur (ex : domainTest) 

- Démarrage et arrêt du domaine 

Utiliser la ligne de commande suivante pour démarrer le domaine <nom_domaine> créé 	précédemment :

	$ : start-domain <nom_domaine>

Pour arrêter un domaine il vous suffit d’exécuter la commande :

	$ : stop-domain <nom_domaine>

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

Un domaine est créer par défaut il s'agit de hephaistosDomain dont le port administrateur est 5000 et l'adresse est 'localhost'. Celui-ci se situe dans le dossier glassfish4/glassfish/domains, et il contient un .WAR du projet.

Commencer par compiler les fichier C à l'aide du makefile disponible qui vont permettre de lancer le serveur. Pour ce faire ouvrir un terminal, déplacez vous dans le dossier 'hephaistos_application' du projet (à l'aide de la commande cd) et executer la commande suivante :
		
		$ : make

1. Pour Démarrer le Serveur :

		$ : ./StartServer

2. pour Stopper le Serveur :

		$ : ./StopServer

<h1>V. Lancement manuel du Serveur</h1>

(Tutoriel détaillé sur : https://dzone.com/articles/how-deploy-war-file-usin)

<h2>A. Lancement de "asadmin tool"</h2>
Ouvrir un terminal dans le dossier 'hephaistos_application' du projet et executer les commandes suivantes : 

	$ : ./glassfish4/glassfish/bin/asadmin

le "asadmin tool" va alors être lancé dans le terminal. vous pouvez quitter "asadmin tool" à tout moment en tapant "exit".

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

