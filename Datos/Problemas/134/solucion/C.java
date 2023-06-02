import java.util.*;
import java.lang.Math;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;

public class C {
    public static void main(String[] args){
        Scanner s = new Scanner(System.in);
        int q = Integer.parseInt(s.nextLine());
        while(q>0){
            String string1,string2;
            string1 = s.nextLine();
            string2 = s.nextLine();
            boolean bandera = true;
            for(int i=0;i<string2.length() && bandera;i++){
                if(string2.charAt(i) == 'a'){
                    bandera = false;
                }
            }
            if(!bandera && string2.length() > 1){
                System.out.println("-1");
            }
            else{
                if(string2.length() == 1 && string2.charAt(0) == 'a'){
                    System.out.println(1);
                }
                else{
                    System.out.println(Math.round(Math.pow(2,string1.length())));
                }
                
            }
            q--;
        }
    }
}
