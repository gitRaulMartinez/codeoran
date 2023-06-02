#include <stdio.h>
long long int min(long long int a,long long int b);
int main(){
	long long int matriz[1010][1010],men,i,j,k,s,t,c,b;
	long long int n,m;
	scanf("%lld",&n);
	scanf("%lld",&m);
	for(i=0;i<n;i++){
		for(j=0;j<n;j++){
			if(i==j){
				matriz[i][j]=0;
			}
			else{
				matriz[i][j]=1000000000000;
			}
		}
	}
	/*
	printf("----------------------------------------------------------\n");
	printf("Matriz de adyacencia\n");
	for(i=0;i<n;i++){
		for(j=0;j<n;j++){
			printf("%lld ",matriz[i][j]);
		}
		printf("\n");
	}
	*/
	for(i=0;i<m;i++){
		scanf("%lld",&s);
		scanf("%lld",&t);
		scanf("%lld",&c);
		matriz[s-1][t-1]=c*-1;
	}
	/*
	printf("----------------------------------------------------------\n");
	printf("Matriz de peso de aristas\n");
	for(i=0;i<n;i++){
		for(j=0;j<n;j++){
			printf("%lld ",matriz[i][j]);
		}
		printf("\n");
	}*/
	for(k=0;k<n;k++){
		for(i=0;i<n;i++){
			if(matriz[i][k]<0){
				for(j=0;j<n;j++){
					if(i!=j && matriz[k][j]<0){
						matriz[i][j]=min(matriz[i][j],matriz[i][k]+matriz[k][j]);
					}
				}
			}
		}
	}
	
	printf("----------------------------------------------------------\n");
	printf("Matriz de Floyd\n");
	for(i=0;i<n;i++){
		for(j=0;j<n;j++){
			printf("%lld ",matriz[i][j]);
		}
		printf("\n");
	}
	b=0;
	for(i=0;i<n;i++){
		for(j=0;j<n;j++){
			if(b==0 && i!=j){
				men=matriz[i][j];
				b=1;
			}
			else{
				if(matriz[i][j]<men && i!=j){
					men=matriz[i][j];
				}
			}
		}
	}
	printf("%lld\n",men*-1);
	return 0;
}
long long int min(long long int a,long long int b){
	if(a<b){
		return a;
	}
	else{
		return b;
	}
}
