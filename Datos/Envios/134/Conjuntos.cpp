#include<bits/stdc++.h>
using namespace std;
const int tam = 1e6;
int a[tam+1];
int b[tam+1];
int main(){
    int m,n;
    cin >> m >> n;
        for(int i=0;i<m;i++){
            cin >> a[i];
        }
        sort(a,a+m);
        for(int i=0;i<n;i++){
            cin >> b[i];
        }
        sort(b,b+n);
        int ap = 0;
        int bp = 0;
        int inter = 0;
        while(ap < m && bp < n){
            if(a[ap]==b[bp]){
                ap++;
                bp++;
                inter++;
            }
            else{
                if(a[ap]<b[bp]){
                    ap++;
                }
                else{
                    bp++;
                }
            }
        }
        cout << m-inter << " " << inter << " " << n-inter << " " << inter+(m-inter)+(n-inter) << endl;
}