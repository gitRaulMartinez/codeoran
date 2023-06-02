#include <bits/stdc++.h>
#define ll long long int
const ll MAX = 2e4;

using namespace std;
char basura;
char caja[MAX+3][MAX+3];
ll profundida(ll i,ll j);
int main(){
	ll r,c;
	cin >> r >> c;
	for(int i=1;i<=r*2;i+=2){
		for(int j=1;j<=c*2;j+=2){
			cin >> basura;
			if(basura=='/'){
				caja[i][j+1]='x';
				caja[i+1][j]='x';
				caja[i][j]=' ';
				caja[i+1][j+1]=' ';
			}
			else{
				if(basura==92){
					caja[i][j]='x';
					caja[i+1][j+1]='x';
					caja[i][j+1]=' ';
					caja[i+1][j]=' ';
				}
				else{
					caja[i][j]=' ';
					caja[i+1][j+1]=' ';
					caja[i][j+1]=' ';
					caja[i+1][j]=' ';
				}
			}
		}
	}
	for(int i=0;i<=r*2+1;i++){
		caja[i][0]='#';
		caja[i][c*2+1]='#';
	}
	for(int i=0;i<=c*2+1;i++){
		caja[0][i]='#';
		caja[r*2+1][i]='#';
	}
	/*
	cout << "Caja shidori" << endl;
	for(int i=0;i<=r*2+1;i++){
		for(int j=0;j<=c*2+1;j++){
			cout << caja[i][j];
		}
		cout << endl;
	}
	*/
	ll res = 0;
	for(ll i=0;i<=r*2;i++){
		for(ll j=0;j<=c*2;j++){
			if(caja[i][j]==' '){
				if(profundida(i,j)==0){
					res++;
					//cout << "Por Caja\n";
				}
			}
			if(caja[i][j]=='/'){
				if(caja[i][j+1]==92){
					if(caja[i+1][j+1]=='/' && caja[i+1][j]==92){
						res++;
						//cout << "Por Cerrado\n";
					}					
				}
			}
		}
	}
	/*
	cout << "Caja shidori" << endl;
	for(int i=0;i<=r*2+1;i++){
		for(int j=0;j<=c*2+1;j++){
			cout << caja[i][j];
		}
		cout << endl;
	}
	*/
	cout << res << endl;
	return 0;
}
ll profundida(ll i,ll j){
	if(caja[i][j]==' '){
		caja[i][j]='H';
		return profundida(i+1,j)+profundida(i-1,j)+profundida(i,j+1)+profundida(i,j-1);
	}
	else{
		if(caja[i][j]=='#'){
			return 1;
		}
	}
	return 0;
}




