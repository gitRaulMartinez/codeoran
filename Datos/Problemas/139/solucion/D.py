edificios = []
for i in range(int(input())):
    edificios.append(list(map(int,input().split())))

edificios.sort(key = lambda x: x[0])


posi = [0,0]
distancia = 0
ultimo_final = 0

for i in range(len(edificios)):
    distancia += abs(edificios[i][0] - posi[0])
    posi[0] = edificios[i][0]
    distancia += abs(edificios[i][2]-posi[1])
    posi[1] = edificios[i][2]
    distancia += edificios[i][1]
    posi[0] += edificios[i][1]
    if i == len(edificios)-1 or edificios[i+1][0]!=posi[0]:
        distancia += edificios[i][2]
        posi[1] = 0

distancia += 100 - posi[0]

print(distancia)


    
