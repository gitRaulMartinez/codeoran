t = int(input())
resultado = []
for indice in range(t):
    e, b = map(int,input().split())
    m = int(input())
    resultado.append("Practice #"+str(indice+1)+": "+str(e)+" "+str(b))
    for i in range(m):
        x = int(input())
        while(b <= x):
            b*=2
        resultado.append(str(x)+" "+str(b-x))
        b-=x

for valor in resultado:
    print(valor)