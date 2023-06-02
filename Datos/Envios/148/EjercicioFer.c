#include <stdio.h>
int digitoMayor(int n);
int main(){
    printf("digito: %i\n",digitoMayor(19272));
    return 0;
}
int digitoMayor(int n){
    int dmay;
    if((n<0)||(n==0)){
        return 0;
    }
    else{
        dmay = n % 10;
        if(dmay < digitoMayor(n/10)){
            return digitoMayor(n/10);
        }
        else{
            return dmay;
        }
    }
}