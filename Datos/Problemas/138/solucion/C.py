import itertools
from unittest import result
def pos_faltantes(i,j,k):
    posis = [0]*5
    resultado = []
    posis[i] = 1 
    posis[j] = 1 
    posis[k] = 1
    
    for i in range(len(posis)):
        if posis[i] == 0:
            resultado.append(i)
    
    return resultado

#----------------------------------------------------------------------
 
 
entradas = list(map(int, input().split()))

resuelto = [0]*5
faltantes = []

for i in range(3):
    for j in range(i+1,4):
        for k in range(j+1,5):
            #print(entradas[i],entradas[j],entradas[k])
            faltantes = pos_faltantes(i,j,k)
            #print(i,j,k)
            #print(faltantes[0],faltantes[1])
            if entradas[i] + entradas[j] + entradas[k] == entradas[faltantes[0]]:
                permutations = list(itertools.permutations([entradas[i],entradas[j],entradas[k]]))
                for permutacion in permutations:
                    #print(permutacion)
                    if((permutacion[0]*3 + permutacion[1]) == entradas[faltantes[1]]):
                        resuelto[0] = entradas[faltantes[0]]
                        resuelto[1] = permutacion[0]
                        resuelto[2] = permutacion[1]
                        resuelto[3] = permutacion[2]
                        resuelto[4] = entradas[faltantes[1]]
            if entradas[i] + entradas[j] + entradas[k] == entradas[faltantes[1]]:
                permutations = list(itertools.permutations([entradas[i],entradas[j],entradas[k]]))
                for permutacion in permutations:
                    if((permutacion[0]*3 + permutacion[1]) == entradas[faltantes[0]]):
                        resuelto[0] = entradas[faltantes[1]]
                        resuelto[1] = permutacion[0]
                        resuelto[2] = permutacion[1]
                        resuelto[3] = permutacion[2]
                        resuelto[4] = entradas[faltantes[0]]

for i in range(4):
    print(resuelto[i],end=" ")
print(resuelto[4])

                        
                        
                        
                    

        