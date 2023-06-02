#include <bits/stdc++.h>
using namespace std;
#define i128 __int128
typedef long long ll;
i128 mult(i128 a,i128 b,i128 m){
	i128 ans=0;
	while(b){
		if(b&1){
			ans = (ans + a)%m;
		}
		a = (a + a)%m;
		b>>=1;
	}
	return ans;
}
i128 power(i128 b,i128 p,i128 m){
	if(p==0){
		return 1;
	}
	if(p&1) return (b%m*power(b,p-1,m)%m)%m;
	else{
		i128 x=power(b,p/2,m)%m;
		return mult(x,x,m)%m;
	}
}
bool millerRabin(i128 p,i128 d){
	i128 a = rand()%(p-4) + 2;
	i128 x = power(a,d,p);
	if(x==1 || x==p-1) return true;
	while(d!=p-1){
		x = mult(x,x,p)%p;
		d = d*2;
		if(x==1) return false;
		if(x==p-1) return true;
	}
	return false;
}
bool isprime(i128 n){
	if(n<=1 || n==4) return false;
	if(n<=3) return true;
	i128 d = n-1;
	while(d%2==0){
		d/=2;
	}
	for(int i=0;i<4;i++) if(!millerRabin(n,d)) return false;
	return true;
}
i128 GCD(i128 a,i128 b){
	if(b==0) return a;
	return GCD(b,a%b);
}
i128 rho(i128 n){
	i128 x=2,xs=2,count,size=2,factor=1;
	i128 c=rand()%n+2;
	do{
		count = size;
		do{
			x = (mult(x,x,n)+c)%n;
			i128 ab;
			(x>xs) ? ab=x-xs : ab=xs-x;
			factor = GCD(ab,n);
		}while(count-- && factor==1);
		size*=2;
		xs=x;
	}while(factor==1);
	if(factor == n){
		do{
			xs = (mult(xs,xs,n)+c)%n;
			i128 ab;
			(x>xs) ? ab=x-xs : ab=xs-x;
			factor = GCD(ab,n);
		}while(factor==1);
	}
	return factor;
}
vector <i128> lista;
void PrimeroFactores(i128 n){
	queue<i128> q;
	q.push(n);
	while(!q.empty()){
		i128 x = q.front();
		q.pop();
		i128 y = rho(x);
		if(isprime(y)) lista.push_back(y);
		else{
			q.push(y);
		}
		if(isprime(x/y)) lista.push_back(x/y);
		else{
			if(x/y!=1&&x/y!=x) lista.push_back(x/y);
		}
	}
}
int main(){
	int t;
	cin >> t;
	while(t--){
		lista.clear();
		ll n1;
		cin >> n1;
		i128 n = (i128) n1;
		PrimeroFactores(n);
		for(auto i: lista){
			cout << (ll)i << " ";
		}
		cout << endl;
	}
	return 0;
}