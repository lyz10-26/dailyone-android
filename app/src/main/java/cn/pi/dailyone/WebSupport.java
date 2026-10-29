package cn.pi.dailyone;
import android.app.Activity;import android.content.Intent;import android.net.Uri;import android.webkit.*;import org.json.*;
final class WebSupport {
 static void configure(WebView web){WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);s.setSupportMultipleWindows(false);s.setUserAgentString(s.getUserAgentString().replace("; wv", "").replace(" Version/4.0", ""));CookieManager.getInstance().setAcceptCookie(true);CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);}
 static boolean official(WebView web){String u=web.getUrl();return u!=null&&"https".equals(Uri.parse(u).getScheme())&&"leetcode.cn".equals(Uri.parse(u).getHost());}
 static JSONObject decode(String value){try{Object p=new JSONTokener(value==null?"null":value).nextValue();if(p instanceof JSONObject)return (JSONObject)p;if(p instanceof String)return new JSONObject((String)p);}catch(Exception e){}return new JSONObject();}
 static boolean route(Activity a,Uri u){String host=u.getHost();if("https".equals(u.getScheme())&&host!=null&&(host.equals("leetcode.cn")||host.endsWith(".leetcode.cn")))return false;if("https".equals(u.getScheme()))try{a.startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception e){}return true;}
 static void destroy(WebView web){if(web==null)return;if(web.getParent() instanceof android.view.ViewGroup)((android.view.ViewGroup)web.getParent()).removeView(web);web.stopLoading();web.destroy();}
 private WebSupport(){}
}
