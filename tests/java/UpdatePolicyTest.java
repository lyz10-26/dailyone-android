package cn.pi.dailyone;
public final class UpdatePolicyTest {
 public static void main(String[] args){
  expect(!UpdatePolicy.newer(5,5),"same version");expect(UpdatePolicy.newer(5,6),"new version");expect(!UpdatePolicy.newer(6,5),"older version");
  boolean invalid=false;try{UpdatePolicy.newer(5,0);}catch(IllegalArgumentException e){invalid=true;}expect(invalid,"invalid version");
  String root="https://github.com/lyz10-26/dailyone-android/releases/download/v1.4.0/";
  expect(UpdatePolicy.trustedApk(root+"DailyOne-1.4.0.apk"),"trusted release");
  for(String url:new String[]{"http://github.com/lyz10-26/dailyone-android/releases/download/v1/x.apk","https://github.com.evil.invalid/lyz10-26/dailyone-android/releases/download/v1/x.apk","https://github.com/other/repo/releases/download/v1/x.apk",root+"../../x.apk",root+"x.zip",root+"x.apk?next=https://evil.invalid", "https://evil.invalid/x.apk"})expect(!UpdatePolicy.trustedApk(url),"reject unexpected origin/path");
  System.out.println("PASS update policy: current/new/old/invalid versions + download origin/path");
 }
 private static void expect(boolean valid,String message){if(!valid)throw new AssertionError(message);}
}
