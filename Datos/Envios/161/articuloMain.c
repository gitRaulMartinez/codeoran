#include <stdio.h>
#include "TADarticulo.h"
int main()
{
    int n,i,codigo; char b;
    ARTICULO v[100];
    int tam = 0;
    /*
    printf("Ingrese la cantidad de articulos: "); scanf("%i",&n);
    int tam = 0;
    for(i=0;i<n;i++){
        agregarOriginal(v,&tam);
    }
    */
    ingresar(v,&tam);
    //printf("Ingrese codigo de articulo para eliminar: "); scanf("%i",&codigo);
    //eliminar(codigo,v,&n);
    
    //printf("Ingrese codigo de articulo para modificar titulo: \n"); scanf("%i",&codigo); scanf("%c",&b);
    //modificar(codigo,v,n);
    
    //cadena autorBuscar;
    //printf("Ingrese autor a buscar: "); scanf("%s",autorBuscar);
    //cantidad(autorBuscar,v,n);
    
    mostrar(v,tam);
    return 0;
}