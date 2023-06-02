n = int(input())
for i in range(n):
    p,e = map(int,input().split())
    if (p-e) >= 10:
        print("YES")
    else:
        print("NO")