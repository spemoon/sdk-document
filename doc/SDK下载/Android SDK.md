# GameService SDK 说明文档_V1.0.0 

<a href="http://api.gameservice.com/gc1/pkgs/files/newgame_v0.1.20.apk" target="_blank" class="sdk-download">下载Android SDK</a>

-------------------


## 一、SDK包含内容



## 二、项目配置

1. 增加工程依赖push-library，alipay_lib；
2. 修改pushsdk_thirdparty_string；
3. 在AndroidManifest中添加声明permission；

## 三、API使用说明

### 3.1 设置屏幕方向

    GameService.setScreenOrientation(int orientation)
     
使用SDK业务接口前调用该函数。参数orientation取值如下：
  
    // 横屏
    GameService.SCREEN_ORIENTATION_LANDSCAPE         
    // 竖屏
    GameService.SCREEN_ORIENTATION_PORTRAIT          

### 3.2 设置业务环境

     
### 3.3 登陆

    GameService.login(Context context, Callback.OnLoginListener listener)
    
调用示例:

	GameService.login(MainActivity.this, new Callback.OnLoginListener() {
	    @Override
	    public void finish(int code, OAuthInfo oAuthInfo) {
	        String msg = "";
	        switch (code) {
	            case StatusCode.FINISH:
	                msg = "token: " + oAuthInfo.getAccessToken();
	                break;
	            case StatusCode.CANCEL:
	                msg = "取消登陆";
	                break;
	            default:
	                break;
	        }
	        Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
	        Log.d("OAuth: ", +code + ": " + msg);
	    }
	});

### 3.4 支付

    GameService.pay(Context context, Order order, Callback.OnPayListener listener)
     
调用示例：

	Order order = testOrder();
	String orderStr = getOrderString(order);
	Log.d("orderStr:", orderStr);
	order.setSign(com.gameservice.sdk.sample.view.main.Rsa
	    .sign(orderStr, com.gameservice.sdk.sample.view.main.Keys.PRIVATE));
	Log.d("signStr: ", order.getSign());
	GameService.pay(this, order, new Callback.OnPayListener() {
	    @Override public void finish(int code, String msg) {
	        switch (code) {
	            case StatusCode.FINISH:
	                msg = "支付完成";
	                break;
	            case StatusCode.CANCEL:
	                msg = "取消支付";
	                break;
	            default:
	                break;
	        }
	        Toast.makeText(TestPayActivity.this, msg, Toast.LENGTH_LONG).show();
	        Log.d("onPay", code + ": " + msg);
	    }
	});

### 3.5 推送相关
     

## 四、相关类介绍

### 4.1 回调函数类

    public class Callback {

        // 支付回调
        public static interface OnPayListener {
            void finish(int code, String msg);
        }

        // 登陆回调
        public static interface OnLoginListener {
            void finish(int code, OAuthInfo authInfo);
        }

    }

### 4.2 状态码类

	public class StatusCode {
	
	    // 处理中
	    public static final int PROCESS = 1000;
	    // 完成
	    public static final int FINISH = 2000;
	    // 取消
	    public static final int CANCEL = 3000;
	    // 失败
	    public static final int ERROR = 5000;
	    // 未知错误
	    public static final int ERROR_UNKNOW = 5001;
	    // 网络错误
	    public static final int ERROR_NETWORK_FAIL = 5002;
	    // 参数错误
	    public static final int ERROR_PARAM = 5003;
	    // 请求超时
	    public static final int ERROR_TIME_OUT = 5004;
	}

### 4.3 认证信息类

	public class OAuthInfo implements BaseType {
	
	    public static final String GRANT_TYPE_MOBILE = "sms_code";
	
	    public static final String GRANT_TYPE_CLIENT_CREDENTIALS = "client_credentials";
	
	    public static final String GRANT_TYPE_SNS_TOKEN = "sns_token”;
	
	    // 认证类型
	    public String getGrantType() 
	 
	    // 认证Token
	    public String getAccessToken() 
	
	
	    // 用户ID
	    public String getUserId() 
	
	    // 用户名称
	    public String getUserName() 
	
	    // 用户昵称
	    public String getNickName() 
	
	    // 用户头像url
	    public String getAvatarUrl() 
	
	}

### 4.4 订单类

    public class Order implements BaseType {
	    // 商品名
	    public String getSubject() 
	    public void setSubject(String subject)
	
	    // 商品描述
	    public String getBody() 
	    public void setBody(String body) 
	
	    // 价格 单位分
	    public int getMoney() 
	    public void setMoney(int money) 
	
	    // 回调地址
	    public String getNotifyUrl() 
	    public void setNotifyUrl(String notifyUrl) 
	
	    // 用户名称
	    public String getUserName() 
	    public void setUserName(String userName) 
	
	    // 用户ID
	    public String getUserId() 
	    public void setUserId(String userId) 
	
	    // 订单号
	    public String getOrderId() 
	    public void setOrderId(String orderId) 
	
	    // 应用ID
	    public String getAppId() 
	    public void setAppId(String appId) 
	
	    // 渠道ID
	    public int getChannelId() 
	    public void setChannelId(int channelId) 
	
	    // IMEI
	    public String getImei() 
	    public void setImei(String imei)
	
	    // MAC地址 
	    public String getMacAddress() 
	    public void setMacAddress(String macAddress) 
	
	    // 扩展信息，开发者选填，回调开发者服务器使用
	    public String getExtInfo() 
	    public void setExtInfo(String extInfo) 
	
	    // 签名信息
	    public String getSign() 
	    public void setSign(String sign) 
    }

## 五、交易签名

交易签名

## 六、代码混淆

GameService的SDK 包是以 jar 包及资源文件提供给用户的,您在混淆自 己 APK 包的时候请不要将 GameService 的 jar 包一起混淆,因为里面有些自定义 UI 控件,若被混 淆后会因为无法找到相关类而抛异常。
您可以在用 ant 构建混淆包的 build.xml 里面对应位置或者在工程的混淆配置文件里加入:
        
        -libraryjars libs/*.jar 
        
以避免GameService的相关的 jar 包被混淆。

## 七、FAQ




###一、将SDK添加到APP工程
1. 将SDK包中libs目录中的文件，添加进开发者工程的libs的目录下
2. 将上述jar包添加进Java Build Path中去。
3. 在AndroidManifest中添加声明permission
	

		
		<uses-permission android:name="android.permission.BATTERY_STATS" />
		    <uses-permission android:name="android.permission.INTERNET" />
		    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
		    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
		    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
		    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
		    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
		    <uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
		    <uses-permission android:name="android.permission.VIBRATE" />
		    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
		    <uses-permission android:name="android.permission.GET_PACKAGE_SIZE" />
		    <uses-permission android:name="android.permission.BROADCAST_STICKY" />
		    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
		    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
		    <uses-permission android:name="android.permission.READ_CALL_LOG" />
		    <uses-permission android:name="android.permission.GET_TASKS" />
		    <uses-permission android:name="android.permission.REORDER_TASKS" />
		    <uses-permission android:name="android.permission.WAKE_LOCK" />
		    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
		
		  <uses-permission android:name="tgx.android.permissions.SERVICE" />
		  <uses-permission android:name="tgx.android.permissions.CLIENT" />
		  <uses-permission android:name="tgx.android.permissions.VOTE" />
		  <uses-permission android:name="com.android.launcher.permission.INSTALL_SHORTCUT" />
		  <uses-permission android:name="com.android.launcher.permission.UNINSTALL_SHORTCUT" />
		
		  <permission
		      android:name="tgx.android.permissions.SERVICE"
		      android:protectionLevel="normal" />
		  <permission
		      android:name="tgx.android.permissions.CLIENT"
		      android:protectionLevel="normal" />
		  <permission
		      android:name="tgx.android.permissions.VOTE"
		      android:protectionLevel="normal" />
		
		  <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
		  <uses-permission android:name="android.permission.BLUETOOTH" />

	以及在<application></application>中添加如下代码
	
		<service
            android:name="com.tgx.push.sdk.MasterService"
            android:permission="tgx.android.permissions.SERVICE"
            android:process="com.tgx.pushsdk.master.service"
            >
            <intent-filter>
                <action android:name="tgx.intent.protect.service.action.START" />
            </intent-filter>
        </service>
        <service android:name="com.tgx.push.sdk.SdkService"
            />
        <receiver
            android:name="com.tgx.push.sdk.AutoConsultReceiver"
            android:permission="tgx.android.permissions.VOTE"
            android:process="com.tgx.pushsdk.master.service"
            >
            <intent-filter android:priority="1" >
                <action android:name="tgx.intent.opensdk.action.VOTE" />

                <data
                    android:host="TGXD_201405141634230591ktsNZU1FF"
                    android:scheme="tgx" />
            </intent-filter>
        </receiver>
        <activity android:name="com.tgx.push.sdk.app.parser.view.PushSdkInfoActivity">
        </activity>
        <activity android:name="com.tgx.push.sdk.app.parser.view.PushSdkDialogActivity">
        </activity>
        <receiver android:name="com.ngds.sdk.util.NgdsStaticReceiver"
         	      android:process="com.tgx.pushsdk.master.service">
            <intent-filter>
                <action android:name="android.intent.action.PACKAGE_ADDED" />
                <action android:name="android.intent.action.PACKAGE_CHANGED" />
                <action android:name="android.intent.action.PACKAGE_DATA_CLEARED" />
                <action android:name="android.intent.action.PACKAGE_INSTALL" />
                <action android:name="android.intent.action.PACKAGE_REMOVED" />
                <action android:name="android.intent.action.PACKAGE_REPLACED" />
                <action android:name="android.intent.action.PACKAGE_RESTARTED" />
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
            </intent-filter>
        </receiver>

        <service
            android:name="com.ngds.sdk.collection.service.CollectService"
            android:process=":remote">
            <intent-filter>
                <action android:name="com.ngds.sdk.collection.service.ICollectService" />
                <action android:name="com.ngds.sdk.collection.service.ISecondary" />
                <action android:name="com.ngds.sdk.collection.service.REMOTE_SERVICE" />
            </intent-filter>
        </service>
        <receiver
            android:name="com.ngds.sdk.collection.util.AlarmReceiver"
            android:process=":remote" />
            
           
###二、API说明
1. 类说明
	
	类|描述
:--|:--
PushSDKAPI|Push 服务的对外API接口	
IMsgReceiver|Push消息回调接口
2. PushSDKAPI
	
	分类|功能|方法
:--|:--|:--
Push服务接口|提供push服务|start ,stop 
Tag 管理接口|Tag的创建与删除|setTags,delTags
消息接口|消息回调接口的注册|registerReceiver
3. AbstractMsgReceiver
	
	分类|功能|方法
:--|:--|:--
消息接口|用于消息的接收|onMessage
调试接口|用于调试时的消息回调|onDebug

	继承抽象类AbstractMsgReceiver,实现如下方法：
	
   3.1 接受到的push消息
		
	public abstract void onMessage(String message)
	功能:接收到的push消息回调。
	参数:message 消息内容	
	
   3.2 接收到的调试过程信息
   
	public void onDebug(String message)
	功能:接收一些用于调试用的过程信息
	参数:message 调试内容
		
4. 方法说明
	
	4.1 push服务初始化及绑定
	
		public final static void start(Context ctx)
		功能:完成push服务的初始化工作，以及与MasterService的自动绑定工作。当masterService第一次启动完成登录操作。
	
	4.2 停止push服务
		
		public final static void stop(Context ctx)
		功能:停止当前应用的push服务，以及与MasterService 的解绑操作。
		参数:ctx 上下文	
    
    4.3 设置Tags
    	
    	public final static void setTags(String[] tags,String charset)
		功能:为App进行属性标注，最大标签数100，使用时必须使用一致的charset，cid不能作		为tag使用
	
	4.4 删除Tags
	
		方法 public final static void delTags(String tag,String charset)
		功能:为App删除标注。
	
	4.5 注册消息接收者
	
		方法 public final static void registerReceiver(Class<? extends 		AbstractMsgReceiver> clzz)
		功能:为App注册消息接收接口
		
	         