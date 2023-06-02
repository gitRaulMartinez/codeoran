n = int(input())
c = 0
x = list(map(int,input().split()))
for i in range(0,n,1):
    if(x[i]%2) == 0:
        c+=1
print(c)