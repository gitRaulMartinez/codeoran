import java.util.*;
public class PiezaPastel{
    public static void main (String args[]){
        Scanner in = new Scanner(System.in);
        int t = in.nextInt(); 
        while(t!=0){
            int p = in.nextInt();
            int e = in.nextInt();
            if((p-e)>=10){
                System.out.print("YES\n");
            }
            else{
                System.out.print("NO\n");
            }
            t--;
        }
    }
}