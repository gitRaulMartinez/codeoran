#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
int main(){
    ll a,b;
    cin >> a >> b;
    while(a!=0 && b!=0){
        ll resto = b % 4;
        switch(resto){
            case 1: cout << a << "i" << endl; break;
            case 2: cout << a*(-1) << endl; break;
            case 3: cout << a*(-1) << "i" << endl; break;
            case 0: cout << a << endl; break;
        }
        cin >> a >> b;
    }
    return 0;
}