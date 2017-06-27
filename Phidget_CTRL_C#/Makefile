
.c.o:
	g++ $(CFLAGS) $(CPPFLAGS) -g -fpermissive -DLINUX  -c -o $@ $< 

CFLAGS = -I../ -I/usr/include 
LIBPHI=  -lphidget21


ifkit_1:ifkit_1.o 
	g++ -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)   ifkit_1.c  -o ifkit_1  $(LIBPHI)

ifkit_test1:ifkit_test1.o 
	g++ -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)   ifkit_test1.c  -o ifkit_test1  $(LIBPHI)



test_capteur_distance:test_capteur_distance.o 
	g++ -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)   test_capteur_distance.c  -o test_capteur_distance  $(LIBPHI)
	
	
	
activite_bis:activite_bis.o 
	gcc -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)   activite_bis.c  -o activite_bis  $(LIBPHI)

activite_bis_capteur12V:activite_bis_capteur12V.o
	g++ -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)  activite_bis_capteur12V.c  -o activite_bis_capteur12V  $(LIBPHI)

activite_PIR_port_digital:activite_PIR_port_digital.o 
	g++ -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)  activite_PIR_port_digital.c  -o activite_PIR_port_digital  $(LIBPHI)

activite_gros_boitier:activite_gros_boitier.o 
	g++ -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)  activite_gros_boitier.c  -o  activite_gros_boitier $(LIBPHI)

activite_petit_boitier:activite_petit_boitier.o 
	g++ -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)  activite_petit_boitier.c  -o  activite_petit_boitier $(LIBPHI)

activite_gros_boitier_4_PIR:activite_gros_boitier_4_PIR.o 
	g++ -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)  activite_gros_boitier_4_PIR.c  -o  activite_gros_boitier_4_PIR $(LIBPHI)
activite_test_PIR_Plafond:activite_test_PIR_Plafond.o 
	g++ -g -w -fpermissive  $(CFLAGS) $(CPPFLAGS)  activite_test_PIR_Plafond.c  -o  activite_test_PIR_Plafond $(LIBPHI)
