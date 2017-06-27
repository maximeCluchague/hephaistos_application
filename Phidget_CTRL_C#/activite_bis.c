// InterfacekitTest.cpp : Defines the entry point for the console application.
//


#include <stdio.h>
#include <math.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <phidget21.h>
#include <time.h>
int status[1]={0};
int flag_status=0;
int flag2=0;
struct timespec now;

double Get_Time()
/*----------------------------------
get the current time in seconds
------------------------------------*/
{
  double temps;
  //  clock_gettime(CLOCK_MONOTONIC, &now);
  clock_gettime(CLOCK_REALTIME, &now);
  temps=now.tv_sec+1.e-9*now.tv_nsec;
  return temps;
}
int IFK_DetachHandler(CPhidgetHandle IFK, void *userptr)
{
	printf("Detach handler ran!\n");
	return 0;
}

int IFK_ErrorHandler(CPhidgetHandle IFK, void *userptr, int ErrorCode, const char *unknown)
{
	printf("Error handler ran!\n");
	return 0;
}





int IFK_SensorChangeHandler(CPhidgetInterfaceKitHandle IFK, void *userptr, int Index, int Value)
{
  if(abs(Value-status[0])>100)  //0 remplace Index
    {
      status[0]=Value;
      flag_status=1;
    }
	return 0;
}


int IFK_AttachHandler(CPhidgetHandle IFK, void *userptr)
{
	CPhidgetInterfaceKit_setSensorChangeTrigger((CPhidgetInterfaceKitHandle)IFK, 0, 0);
	printf("Attach handler ran!\n");
	return 0;
}

int test_interfacekit()
{
	int numInputs, numOutputs, numSensors;
	int err,value;
    double t, deltaT,t2,deltaT2;
	CPhidgetInterfaceKitHandle IFK = 0;
	FILE *fp;

	//CPhidget_enableLogging(PHIDGET_LOG_VERBOSE, NULL);
	
	CPhidgetInterfaceKit_create(&IFK);

    
    //interruptions
	CPhidget_set_OnAttach_Handler((CPhidgetHandle)IFK, IFK_AttachHandler, NULL);
	CPhidget_set_OnDetach_Handler((CPhidgetHandle)IFK, IFK_DetachHandler, NULL);
	CPhidget_set_OnError_Handler((CPhidgetHandle)IFK, IFK_ErrorHandler, NULL);
    
    
    
	CPhidgetInterfaceKit_set_OnSensorChange_Handler(IFK, IFK_SensorChangeHandler, NULL);//ports analogiques
    
    
	
	
	CPhidget_open((CPhidgetHandle)IFK, -1);

	//wait 5 seconds for attachment
	if((err = CPhidget_waitForAttachment((CPhidgetHandle)IFK, 5000)) != EPHIDGET_OK )
	{
		const char *errStr;
		CPhidget_getErrorDescription(err, &errStr);
		printf("Error waiting for attachment: (%d): %s\n",err,errStr);
		return 0;
	}
	fp=fopen("log_activite.txt","a");
    
    t=Get_Time();
	while(1)
	{
        
        
        
        
	  if(flag_status)
	    {
            
            deltaT=Get_Time()-t;
            
          if(status[0]>500)
          {
              if(flag2!=1)
              {
                t2=Get_Time();
                printf("capteur (%d) temps %fs delta temps %fs  deltahaut-bas trigtime \n",status[0],Get_Time(),deltaT);
                fprintf(fp,"capteur (%d)   temps   %f delta temps %f  deltahaut-bas trigtime \n",status[0],Get_Time(),deltaT);
              }
              flag2=1;
          }
          
          if(status[0]<100)
          {
              deltaT2=Get_Time()-t2;
              
              printf("capteur (%d) temps %fs delta temps %fs  deltahaut-bas %fs \n",status[0],Get_Time(),deltaT,deltaT2);
              fprintf(fp,"capteur (%d)   temps   %f delta temps %f  deltahaut-bas %fs\n",status[0],Get_Time(),deltaT,deltaT2);
              flag2=0;
          }
          
          else
          {deltaT2=0;
              
            
              
              
          }
          
            
            
            t=Get_Time();
	      
	      flag_status=0;
          
	    }
	}
}

int main(int argc, char* argv[])
{
	test_interfacekit();
	return 0;
}

