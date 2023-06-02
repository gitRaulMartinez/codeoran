#include <stdio.h>
#include <string.h>
#include "TADarticulo.h"

ARTICULO agregar(){
    ARTICULO nuevo;
    char b;
    printf("Ingrese Codigo: "); scanf("%i",&nuevo.cod); scanf("%c",&b);
    printf("Ingrese Titulo: "); scanf("%s",nuevo.titulo);
    printf("Ingrese autor: "); scanf("%s",nuevo.autor);
    return nuevo;
}
void eliminar(int codigo,ARTICULO v[],int *n){
    int p = -1;
    int i;
    for(i=0;i<(*n);i++){
        if(v[i].cod == codigo){
            p = i;
        }
    }
    
    if(p == -1){
        printf("No se encontro el articulo\n");
    }
    else{
        for(i = p ; i < (*n)-1 ; i++){
            v[i] = v[i+1];
        }
        (*n) = (*n) - 1;
    }
    
}
void modificar(int codigo,ARTICULO v[],int n){
    int p = -1;
    int i;
    for(i=0;i<n;i++){
        if(v[i].cod == codigo){
            p = i;
        }
    }
    if(p == -1){
        printf("No se encontro el articulo\n");
    }
    else{
        cadena nuevoTitulo;
        printf("Ingrese el nuevo titulo para el articulo: "); scanf("%s",nuevoTitulo);
        strcpy(v[p].titulo,nuevoTitulo);
    }
}
void cantidad(cadena autorBuscar,ARTICULO v[],int n){
    int cont = 0;
    int i;
    for(i = 0; i < n; i++){
        if(strcmp(autorBuscar,v[i].autor)==0){
            cont++;
        }
    }
    printf("Cantidad de articulos del determiinado autor es: %i",cont);
}
void mostrar(ARTICULO v[],int n){
    int i;
    for(i=0;i<n;i++){
        printf("Codigo: %i\n",v[i].cod);
        printf("Titulo: %s\n",v[i].titulo);
        printf("Autor: %s\n",v[i].autor);
    }
}

void agregarOriginal(ARTICULO v[],int *n){
    ARTICULO nuevo;
    char b;
    printf("Ingrese Codigo: "); scanf("%i",&nuevo.cod); scanf("%c",&b); //flush(stdin);
    printf("Ingrese Titulo: "); scanf("%s",nuevo.titulo);
    printf("Ingrese autor: "); scanf("%s",nuevo.autor);
    v[(*n)] = nuevo;
    (*n) = (*n) + 1;
}

void ingresar(ARTICULO v[],int *n){
    int tam,i;
    char b;
    printf("Ingrese la cantidad de N: "); scanf("%i",&tam);
    (*n) = tam;
    for(i=0;i<(*n);i++){
        printf("Ingrese Codigo: "); scanf("%i",&v[i].cod); scanf("%c",&b); //flush(stdin);
        printf("Ingrese Titulo: "); scanf("%s",v[i].titulo);
        printf("Ingrese autor: "); scanf("%s",v[i].autor);
    }
}