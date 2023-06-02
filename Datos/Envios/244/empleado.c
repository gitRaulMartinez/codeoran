#include<stdio.h>
	enum departamento {personal, administrativo};

	int main(){
		typedef char cadena [50];
		struct empleados{
			cadena nombre;
			enum departamento depa;
			float sueldo;
		};
		typedef struct empleados EMPLEADOS;
		
		int N;
		int i;
		int cont=0;
		int opc; //opcion 0 u opcion 1
		EMPLEADOS v[100];
		
		printf("INGRESE LA CANTIDAD DE EMPLEADOS: \n");
		scanf("%i", &N);
		fgetc(stdin);
		
		for(i=0; i<N; i++){
			printf("INGRESA EL NOMBRE DEL EMPLEADO %i : \n", i+1); gets(v[i].nombre);
			
			printf("INGRESE EL DEPARTAMENTO AL QUE CORRESPONDA EL EMPLEADO: \n");
			printf("0=personal \n");
			printf("1=administrativo \n");
			
			fgetc(stdin);
			switch(opc){
				case 0: v[i].depa=personal; break; 
				case 1: v[i].depa=administrativo; break; 
			}
			printf("INGRESE SUELDO DEL EMPLEADO: \n"); 
			scanf("%f", &v[i].sueldo);
			
			fgetc(stdin);
		}
		
		
		for(i=0; i<N; i++){
			if(v[i].depa==administrativo){
				if(v[i].sueldo<16.000){
					cont=cont+1;
				}
			}
		}
		printf("la cantidad de empleados que cobran mas de $16.000 es: %i \n", cont);
		
	return 0;
	}
