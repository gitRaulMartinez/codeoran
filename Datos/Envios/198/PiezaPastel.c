#include<stdio.h>
int main(){
    int t;
    scanf("%i",&t);
    while(t--){
        int p,e;
        scanf("%i%i",&p,&e);
        if(p-e>=10){
            printf("YES\n");
        }
        else{
            printf("NO\n");
        }
    }
}