n = int(input())
c = 0
for i in range(0,n,1):
    x = int(input())
    if x % 2 == 0:
        c+=1
print(c)