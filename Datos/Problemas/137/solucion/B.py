def fiborooji(a,b):
    secuencia = [a,b]
    bandera = False
    while not bandera:
        secuencia.append((secuencia[-1] + secuencia[-2])%10)
        if len(secuencia) >= 4 and secuencia[-2] == secuencia[0] and secuencia[-1] == secuencia[1]:
            bandera = True
    return len(secuencia)

a, b = map(int, input().split())
print(fiborooji(a,b))
