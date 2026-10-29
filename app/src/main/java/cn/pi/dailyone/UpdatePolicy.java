package cn.pi.dailyone;
import java.net.URI;
/** Pure version and download-origin policy, shared by the updater and local tests. */
final class UpdatePolicy {
 static final String MANIFEST="https://raw.githubusercontent.com/lyz10-26/dailyone-android/main/update.json";
 static boolean newer(long installed,long remote){if(installed<1||remote<1)throw new IllegalArgumentException("版本号无效");return remote>installed;}
 static boolean trustedApk(String url){try{URI u=new URI(url);String path=u.getPath();return "https".equals(u.getScheme())&&"github.com".equals(u.getHost())&&u.getUserInfo()==null&&u.getPort()==-1&&u.getQuery()==null&&u.getFragment()==null&&path!=null&&path.startsWith("/lyz10-26/dailyone-android/releases/download/")&&!path.contains("..")&&!path.contains("\\")&&path.endsWith(".apk");}catch(Exception e){return false;}}
 private UpdatePolicy(){}
}
