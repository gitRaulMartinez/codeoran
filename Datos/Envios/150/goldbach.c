#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <time.h>
int primo(long long int n);
int main(){
	clock_t tiempo_inicio, tiempo_final;
	double segundos;
	long long int n;
	long long int i;
	long long int r;
	long int b;
	while(scanf("%lld",&n)!=EOF){
		tiempo_inicio = clock();
		b=0;
		if(n==2){
			printf("khe!: %ld\n",1);
		}
		else{
			if(n%2==0){
				printf("%ld\n",2);
			}
			else{
				i=3;
				while(b==0 && i*i<=n){
					r=n%i;
					if(r==2 || r==0){
						b=1;
					}
					else{
						i=i+2;
					}
				}
				if(b==1){
					if(r==0){
						b=0;
						n=n-2;
						while(i*i<=n && b==0){
							//printf("%ld\n",i);
							r=n%i;
							if(r==0){
								b=1;
							}
							else{
								i=i+2;
							}
						}
						if(b==0){
							printf("%ld\n",2);
						}
						else{
							printf("%ld\n",3);
						}
					}
					else{
						b=0;
						while(i*i<=n && b==0){
							//printf("%lld\n",i);
							r=n%i;
							if(r==0){
								b=1;
							}
							else{
								i=i+2;
							}
						}
						if(b==0){
							printf("%ld\n",1);
						}
						else{
							printf("%ld\n",3);
						}
					}
				}
				else{
					printf("nani: %ld\n",1);
				}
			}
		}
		tiempo_final = clock();
		segundos = (double)(tiempo_inicio - tiempo_final);
		printf("%.16g milisegundos\n", segundos * 1000.0);
	}
	return 0;
}
