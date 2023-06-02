import java.util.Scanner;

public class Ejemplo {
    public static void main(String[] args){
        Scanner leer = new Scanner(System.in);
        int n = leer.nextInt();
        int c = 0;
        for(int i=0;i<n;i++){
            int x = leer.nextInt();
            if(x%2==0) c++;
        }
        System.out.println(c);
    }
}