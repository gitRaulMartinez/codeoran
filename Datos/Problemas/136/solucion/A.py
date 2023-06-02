cadena = input()
contador = [0]*26

for i in cadena:
    contador[ord(i)-ord("a")]+= 1

par = False
impar = False

for i in contador:
    if par and impar:
        break
    if i % 2 == 0 and i != 0:
        par = True
    elif i != 0:
        impar = True

if par and impar:
    print("0/1")
elif par:
    print(0)
else:
    print(1)