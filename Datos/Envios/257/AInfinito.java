import java.util.*;

public class AInfinito {
    public static void main(String[] args){
        boolean b = true;
        Scanner s = new Scanner(System.in);
        int t = s.nextInt();
        while(t > 0){
            int x,y;
            x = s.nextInt();
            y = s.nextInt();
            if(y%x == 0){
                System.out.println("1 "+y/x);
            }
            else{
                System.out.println("0 0");
            }
            while(b){
                System.out.println("Naniiii");
            }
            t--; 
        }
    }
}