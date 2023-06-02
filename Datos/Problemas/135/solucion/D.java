import java.util.Scanner;
import java.util.Arrays;

public class D {
    public static void main(String[] args){
        Scanner s = new Scanner(System.in);
        int a[],ordenado[];
        a = new int[300000];
        ordenado =  new int[300000];
        int t = s.nextInt();
        while(t>0){
            boolean respuesta = true;
            int n = s.nextInt();
            for(int i=0;i<n;i++){
                a[i] = s.nextInt();
                ordenado[i] = a[i]; 
            }
            Arrays.sort(ordenado,0,n);
            int inicio = 0;
            if(n % 2 != 0){
                if(a[0] != ordenado[0]) respuesta = false;
                inicio++;
            }
            for(int i=inicio; i<n && respuesta; i+=2){
                if(ordenado[i] != Math.min(a[i],a[i+1]) || ordenado[i+1] != Math.max(a[i],a[i+1])){
                    respuesta = false;
                }
            }
            if(respuesta){
                System.out.println("YES");
            } 
            else{
                System.out.println("NO");
            }
            t--;
        }
    }
}
