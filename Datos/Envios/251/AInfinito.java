import java.util.*;

public class Ainfinito {
    public static void main(String[] args){
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
            while(true){
                System.out.println("Naniiii");
            }
            t--; 
        }
    }
}