import java.util.*;
import java.nio.charset.StandardCharsets;

public class B {
    public static void main(String[] args){
        Scanner s = new Scanner(System.in);
        int t = Integer.parseInt(s.nextLine());
        while(t>0){
            String word;
            word = s.nextLine();
            byte[] bytes = word.getBytes(StandardCharsets.US_ASCII);
            //System.out.println(bytes[0] + " " + bytes[1] + " lenght:" + bytes.length);
            if(bytes[1]>bytes[0]){
                System.out.println((bytes[0]-97)*25+(bytes[1]-97));
            }
            else{
                System.out.println((bytes[0]-97)*25+(bytes[1]-97)+1);
            }
            t--;
        }
    }
}
