#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int MAX=100;
vector <ll> adj[MAX+1];
struct pares{
	ll x;
	ll y;
};
typedef struct pares PAR;
PAR e1[MAX+1];
PAR e2[MAX+1];
queue <ll> cola;
bool vis[MAX+1]={false};
ll pase[MAX+1]={0};
ll mcd(ll x, ll y);
ll dist(ll a,ll b);
int main(){
	ll n;
	cin >> n;
	for(ll i=0;i<n;i++){
		cin >> e1[i].x >> e1[i].y;
	}
	for(ll i=0;i<n;i++){
		cin >> e2[i].x >> e2[i].y;
	}
	for(ll i=0;i<n-1;i++){
		for(ll j=i+1;j<n;j++){
			bool band=true;
			PAR equipo;
			equipo.x=e1[j].x-e1[i].x;
			equipo.y=e1[j].y-e1[i].y;
			for(ll k=0;k<n;k++){
				PAR enemigo;
				enemigo.x=e2[k].x-e1[i].x;
				enemigo.y=e2[k].y-e1[i].y;
				if(dist(equipo.x,equipo.y)>=dist(enemigo.x,enemigo.y)){
					ll vectorial = (equipo.x*enemigo.y) - (enemigo.x*equipo.y);
					if(vectorial==0){
						if((equipo.x>0 && enemigo.x>0)||(equipo.x==0 && enemigo.x==0)||(equipo.x<0 && enemigo.x<0)){
							if((equipo.y>0 && enemigo.y>0)||(equipo.y==0 && enemigo.y==0)||(equipo.y<0 && enemigo.y<0)){
								band=false;
							}
						}
					}
				}
			}
			for(ll k=0;k<n;k++){
				PAR enemigo;
				if(k!=j){
					enemigo.x=e1[k].x-e1[i].x;
					enemigo.y=e1[k].y-e1[i].y;
					if(dist(equipo.x,equipo.y)>=dist(enemigo.x,enemigo.y)){
						ll vectorial = (equipo.x*enemigo.y) - (enemigo.x*equipo.y);
						if(vectorial==0){
							if((equipo.x>0 && enemigo.x>0)||(equipo.x==0 && enemigo.x==0)||(equipo.x<0 && enemigo.x<0)){
								if((equipo.y>0 && enemigo.y>0)||(equipo.y==0 && enemigo.y==0)||(equipo.y<0 && enemigo.y<0)){
									band=false;
								}
							}
						}
					}
				}
			}
			if(band){
				adj[i].push_back(j);
				adj[j].push_back(i);
			}
		}
	}
	cola.push(0);
	vis[0]=true;
	pase[0]=0;
	while(!cola.empty()){
		ll actual=cola.front();
		cola.pop();
		for(ll i: adj[actual]){
			if(!vis[i]){
				vis[i]=true;
				pase[i]=pase[actual]+1;
				cola.push(i);
			}
		}
	}
	if(vis[n-1]){
		cout << pase[n-1] << endl;
	}
	else{
		cout << "-1\n";
	}
	return 0;
}
ll mcd(ll x, ll y){
    return y ? mcd(y, x % y) : x;
}
ll dist(ll a,ll b){
	return a*a+b*b;
}

/*
5
0 0 1 1 4 1 3 3 4 4
2 2 3 4 4 3 1 2 2 3
*/
