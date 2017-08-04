#include <stdio.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <string.h>
#include <netdb.h>
#include <unistd.h>
/* 	
 * Documentation :
 * https://stackoverflow.com/questions/28829310/reading-input-from-c-socket-client-to-java-socket-server
 */
void error(char *msg) 
{
    perror(msg);
    exit(0);
}

int main(int argc, char *argv[])
{
    int sockfd, portno;
    struct sockaddr_in serv_addr;
    struct hostent *server;
    int n;
    char buffer[256];

    if (argc < 4)
    {
        error("ERROR, usage : ./client <adresseServeurSocket> <port> <Json_message>");
    }

    sockfd = socket(AF_INET, SOCK_STREAM, 0);

    if (sockfd < 0)
    {
        error("ERROR opening socket");
    }

    server = gethostbyname(argv[1]);

    if (server == NULL)
    {
        error("ERROR, host not found\n");
    }

    bzero((char *) &serv_addr, sizeof(serv_addr));
    portno = atoi(argv[2]);
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(portno);

    bcopy((char *)server->h_addr, (char *)&serv_addr.sin_addr.s_addr, server->h_length);

    if (connect(sockfd,(struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0)
    {
        error("ERROR connecting to server");
    }

    n = write(sockfd,argv[3],strlen(argv[3]));

    if (n < 0)
    {
        error("ERROR writing to socket");
    }

    if (n < 0)
    {
        error("ERROR reading from socket");
    }

    printf("%s\n", buffer);
    return 0;
}
