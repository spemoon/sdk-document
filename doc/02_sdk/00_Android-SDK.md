# GameService SDK 说明文档_V1.0.6 
------

<a href="../../static/download/GameService_Sdk_Bundle_V1.0.6.zip" target="_blank" class="sdk-download">下载Android  SDK</a>

## 一、SDK包含内容

* GameService SDK 说明文档_V1.0.6.pdf

* 依赖工程 library
  * PushSDK_Release
  * alipay_lib
  
* 示例程序工程 samples

* 示例程序安装包 SDKSample_V1.0.6.apk

* 密钥生成工具 openssl

## 二、项目配置

2.1 增加工程依赖项目PushSDK_Release，alipay_lib；

2.2 拷贝 SDKSample libs 下的文件到主工程的libs下；

2.3 在PushSDK_Release的res/values/pushsdk_thirdparty_string.xml 中：
	
		<?xml version="1.0" encoding="utf-8" standalone="no"?>
		<resources>
		<string name="permission_service">[your_prefix].android.permissions.SERVICE</string>
		<string name="permission_provider">[your_prefix].android.permissions.PROVIDER</string>
		<string name="permission_vote">[your_prefix].android.permissions.VOTE</string>
		<string name="permission_client">[your_prefix].android.permissions.CLIENT</string>
		<string name="action_protect_service_start">[your_prefix].intent.protect.service.action.START</string>
		<string name="action_protect_broadcast_service">[your_prefix].intent.protect.service.action.BROADCAST</string>
		<string name="action_protect_broadcast_clinet">[your_prefix].intent.protect.client.action.BROADCAST</string>
		<string name="action_opensdk_vote">[your_prefix].intent.opensdk.action.VOTE</string>
		<string name="action_opensdk_consult">[your_prefix].intent.opensdk.action.CONSULT</string>
		<string name="action_api_service_start">[your_prefix].intent.api.service.action.START</string>
		<string name="sdk_appid">8</string>
		<string name="sdk_appkey">sVDIlIiDUm7tWPYWhi6kfNbrqui3ez44</string>
		<string name="sdk_domain">TGXD_201405141634230591ktsNZU1FF</string>
		<string name="sdk_scheme">[your_prefix]</string>
		</resources>

* 将[your_prefix]修改成开发者需要指定的简称(一般以公司缩写为准)。如：ngds。

* sdk_appid 的值为你在<a href="http://developers.gameservice.com/">GameService 开发网站</a>里真实分配到的appid,

* sdk_appkey 的值为你在<a href="http://developers.gameservice.com/">GameService 开发网站</a>里真实分配到的appkey。

2.4 在主工程AndroidManifest中添加如下声明permission并做出相应替换：

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
	    <uses-permission android:name="android.permission.BROADCAST_STICKY" />
	    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
	    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
	    <uses-permission android:name="android.permission.WAKE_LOCK" />

	    <uses-permission android:name="[your_prefix].android.permissions.SERVICE" />	    <uses-permission android:name="[your_prefix].android.permissions.CLIENT" />	    <uses-permission android:name="[your_prefix].android.permissions.VOTE" />		<permission android:name="[your_prefix].android.permissions.SERVICE" android:protectionLevel="normal" />	    <permission android:name="[your_prefix].android.permissions.CLIENT" android:protectionLevel="normal" />	    <permission android:name="[your_prefix].android.permissions.VOTE" android:protectionLevel="normal" />
	
* 将[your_prefix]修改成开发者需要指定的简称(一般以公司缩写为准)，如：ngds，须和pushsdk_thirdparty_string.xml中的设置保持一致。

				
2.5 在主工程AndroidManifest中增加如下activity, meta-data, service, receiver：

		<!-- 渠道号 -->
        <meta-data
            android:name="NGDS_CHANNEL"
            android:value="14" />
            
        <!-- 登陆 -->
        <activity
            android:name="com.gameservice.sdk.activity.LoginSelectActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.Translucent.NoTitleBar.Fullscreen" />
        <activity
            android:name="com.gameservice.sdk.activity.LoginMobileActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
        <activity
            android:name="com.gameservice.sdk.activity.LoginVerifyCodeActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />

        <!--支付-->
        <activity
            android:name="com.gameservice.sdk.activity.PayTypeSelectActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
        <activity
            android:name="com.gameservice.sdk.activity.BankCardActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />

        <activity
            android:name="com.gameservice.sdk.activity.PayCodeActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />

        <activity
            android:name="com.gameservice.sdk.activity.CoinActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
        <activity
            android:name="com.gameservice.sdk.activity.CoinRechargeActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
        <activity
            android:name="com.gameservice.sdk.activity.PhoneCardActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
        <activity
            android:name="com.gameservice.sdk.activity.PhoneCardLoginActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
        <activity
            android:name="com.gameservice.sdk.activity.PhoneCardResultActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />

        <!--用户中心-->
        <activity
            android:name="com.gameservice.sdk.activity.UserCenterActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
        <activity
            android:name="com.gameservice.sdk.activity.UserBalanceActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
        <activity
            android:name="com.gameservice.sdk.activity.UserPwdActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
        <activity
            android:name="com.gameservice.sdk.activity.UserPwdForgetCodeActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />

        <!--Web页面-->
        <activity
            android:name="com.gameservice.sdk.activity.WebActivity"
            android:configChanges="keyboardHidden|orientation"
            android:theme="@android:style/Theme.NoTitleBar" />
            
        <!--push-->
		<service		    android:name="com.tgx.push.sdk.MasterService"
		    android:process="com.tgx.pushsdk.master.service"		    android:permission="[your_prefix].android.permissions.SERVICE">		      <intent-filter>		          <action android:name="[your_prefix].intent.protect.service.action.START" />		      </intent-filter>		 </service>		 <service android:name="com.tgx.push.sdk.SdkService" />		 <receiver		    android:name="com.tgx.push.sdk.AutoConsultReceiver"		    android:permission="[your_prefix].android.permissions.VOTE">		      <intent-filter android:priority="1" >		           <action android:name="[your_prefix].intent.opensdk.action.VOTE" />		           <data android:host="[your_host]" android:scheme="[your_prefix]" />		      </intent-filter>		 </receiver>		     		 <receiver android:name="com.gameservice.sdk.collection.util.NgdsStaticReceiver">
            <intent-filter>
                <action android:name="android.intent.action.PACKAGE_ADDED" />
                <action android:name="android.intent.action.PACKAGE_CHANGED" />
                <action android:name="android.intent.action.PACKAGE_DATA_CLEARED" />
                <action android:name="android.intent.action.PACKAGE_INSTALL" />
                <action android:name="android.intent.action.PACKAGE_REMOVED" />
                <action android:name="android.intent.action.PACKAGE_REPLACED" />
                <action android:name="android.intent.action.PACKAGE_RESTARTED" />
                <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
            </intent-filter>
        </receiver>
		<service
            android:name="com.gameservice.sdk.collection.service.CollectService"
            android:process=":remote">
            <intent-filter>
                <action android:name="com.gameservice.sdk.collection.service.ICollectService" />
                <action android:name="com.gameservice.sdk.collection.service.ISecondary" />
                <action android:name="com.gameservice.sdk.collection.service.REMOTE_SERVICE" />
            </intent-filter>
        </service>

        <receiver
            android:name="com.gameservice.sdk.collection.util.AlarmReceiver"
            android:process=":remote" />
            
		<activity
		android:name="com.tgx.push.sdk.app.parser.view.PushSdkInfoActivity"/>
		<activity
		android:name="com.tgx.push.sdk.app.parser.view.PushSdkDialogActivity"/>
		
		
* 将[your_prefix]修改成开发者需要指定的简称(一般以公司缩写为准)，如：ngds，须和pushsdk_thirdparty_string.xml中的设置保持一致。

* 将[your_host]修改成pushsdk_thirdparty_string.xml的sdk_domain。

* 渠道号，默认配置成14，有发渠道包的请填具体的渠道号。

2.6 在应用开始的时候调用 GameService.startPushService（Context context）开启服务。一般放置在Application的子类中进行调用，如
	
	
	public class BaseApp extends Application {
	    @Override
	    public void onCreate() {
	        super.onCreate();
	        GameService.startPushService(this);
	    }
	}
然后在AndroidManifest.xml中声明applcaition中的name为BaseApp即可

	...
	 <application
	        android:name=".base.BaseApp"
	        ....
        

## 三、API使用说明

### 3.1 设置屏幕方向
* 功能描述：

	开发者可以根据需要设置SDK业务界面的屏幕方向。一般只需要在调用SDK业务接口前执行。

* 接口：

	    GameService.setScreenOrientation(int orientation)

* 参数说明：    
 
	使用SDK业务接口前调用该函数。参数orientation取值如下：
    	
	    GameService.SCREEN_ORIENTATION_LANDSCAPE             // 横屏
	    GameService.SCREEN_ORIENTATION_PORTRAIT              // 竖屏

### 3.2 获取认证信息     
* 功能描述：

	获取登录用户的认证信息。

* 接口：

	    GameService.getOAuthInfo(Context context)

* 参数说明：     

	context   上下文句柄

* 返回结果类型OAuthInfo：

	已登录返回OAuthInfo；未登录的情况下返回null。
	
### 3.3 登录
* 功能描述：

	SDK提供了3中认证方式：手机认证登录、QQ第3方登录、新浪微博第3方登录。调用成功后会在回调函数中返回用户认证信息。

* 接口：

	    GameService.login(Context context, boolean enableSkip, OnLoginListener listener)

* 参数说明：

| 参数名称           | 说明          	  	    |
| -----------------	|--------------------------|
| context    	    | 上下文句柄		           |
| enableSkip     	| 是否允许跳过登录：   	  |
|     	    | true 允许登录选择页面会出现跳过按钮；           |
|     	    | false 不允许登录选择页面不会出现跳过按钮；              |
| listener         | 登录回调函数     		  |
	
* 调用示例：

	    if (GameService.getOAuthInfo(this) == null) {
            GameService.login(MainActivity.this, false, new OnLoginListener() {
                @Override
                public void finish(int code, OAuthInfo oAuthInfo) {
                    String msg = "";
                    switch (code) {
                        case StatusCode.FINISH:
                            if (oAuthInfo != null) {
                                msg = "token: " + oAuthInfo.getAccessToken();
                            }
                            break;
                        case StatusCode.CANCEL:
                            msg = "跳过登录";
                            break;
                        default:
                            break;
                    }
                    Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
                    Log.d(TAG, +code + ": " + msg);
                }
            });
        } else {
            String msg = "你已经是登录状态了，不需要再执行登录操作";
            Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
            Log.d(TAG, msg);
        }

### 3.4 注销登录
* 功能描述：

	开发者可以根据需要注销用户的登录状态。

* 接口：

	    GameService.logout(Context context)

* 参数说明：     

	context   上下文句柄

* 返回结果类型boolean：
  * true 注销登录成功
  * false 注销登录失败

* 调用示例：

        String msg = "";
        if (GameService.getOAuthInfo(this) == null) {
            msg = "你还没有登录，无法执行注销登录操作";
        } else {
            boolean result = GameService.logout(this);
            if (result) {
                msg = "注销登录成功";
            } else {
                msg = "注销登录失败";
            }
        }
        Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
        Log.d(TAG, msg);
        
### 3.5 支付

* 功能描述：
SDK提供了银行卡、充值卡、支付宝登录多种支付方式。调用完成的通知返回有两种：

    1. 客户端异步回调，这个只作状态通知，不做入账依据，表明交易是完成还是取消；
    2. 服务端通过notify_url回调，平台服务端处理完支付业务后回调生成订单传的notify_url，相关参数会跟在url后面，可以根据status判断是否入账成功，具体可以参考 <a href="http://docs.gameservice.com/docs/sdk/server.html/">GameService 服务端开发说明</a>。

* 接口：

	    GameService.pay(Context context, Order order, OnPayListener listener)
     
* 参数说明：
    
| 参数名称           | 说明          	  	    |
| -----------------	|--------------------------|
| context    	    | 上下文句柄		           |
| order     	    | 业务订单信息   	  |
| listener    	    | 支付回调函数           |
	
* 调用示例：

	    /**
	     * 调用支付功能
	     */
	    public void doPay() {
	        Order order = testOrder();
	        // 生成待签名字符串
	        String orderStr = getOrderString(order);
	        Log.d(TAG, "orderStr:" + orderStr);
	        // 签名
	        order.setSign(Rsa.sign(orderStr, Keys.PRIVATE));
	        Log.d(TAG, "signStr: " + order.getSign());
	        GameService.pay(this, order, new OnPayListener() {
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
	                Log.d(TAG, "onPay: " + code + ": " + msg);
	            }
	        });
	    }
                
	
	    /**
         * 生成测试订单
         * @return
         */
	    public Order testOrder() {
	        ApplicationInfo appInfo = null;
	        try {
	            appInfo = getPackageManager()
	                .getApplicationInfo(getPackageName(),
	                    PackageManager.GET_META_DATA);
	        } catch (PackageManager.NameNotFoundException e) {
	            e.printStackTrace();
	        }
	
	        Order result = new Order();
	        result.setAppId(getString(
	            R.string.sdk_appid));                                                     // 应用ID
	        result.setChannelId(appInfo.metaData.getInt("NGDS_CHANNEL"));                 // 渠道ID
	        result.setOrderId(getOutTradeNo());                                           // 订单号
	        result.setUserId(edtUserId.getText().toString());                             // 用户ID
	        result.setUserName(edtUserName.getText().toString());                         // 用户名称
	        result.setSubject(edtProduct.getText().toString() + result.getOrderId());     // 商品名称
	        result.setBody(edtDesc.getText().toString());                                 // 商品描述
	        result.setMoney(Integer.valueOf(edtMoney.getText().toString()));              // 商品价格：单位 分
	        result.setNotifyUrl(edtUrl.getText().toString());                             // 回调地址
	        result.setImei("imeixxx");                                                    // IMEI
	        result.setMacAddress("05-16-DC-59-C2-34");                                    // MAC地址
	        result.setExtInfo("extra string");                                            // 扩展信息
	
	        return result;
    	}

### 3.6 统计采集
 正确集成如下代码，才能够保证获取正确的用户使用基本数据。

* 在每个Activity的onResume方法中调用 GameService.onResume(this) ,onPause方法中调用  GameService.onPause(this)

		@Override
	    protected void onPause() {
	        GameService.onPause(this);
	        super.onPause();
	    }
	
	    @Override
	    protected void onResume() {
	        GameService.onResume(this);
	        super.onResume();
	    } 
    
* 确保在所有的Activity中都调用 MobclickAgent.onResume() 和MobclickAgent.onPause()方法，这两个调用将不会阻塞应用程序的主线程，也不会影响应用程序的性能。
* 玩家用户登录行为记录（用于玩家行为统计以及进行玩家间p2p推送）：	
	
		GameService.onPlayerLogin(context, PLAYER_ID); 
其中PLAYER_ID为玩家id。
* 玩家用户登出记录（用于玩家行为统计以及不再接收玩家间p2p推送）：

		GameService.onPlayerLogout(Context context); 
* 玩家用户付款行为统计：

		GameService.onPay(Context context, String playerId, String payAmount)


### 3.7 推送服务

欲正确使用推送服务需注意，可参造demo中PushServiceActivity中的如下代码


	//要正常的使用推送服务，必须注册一个父类为AbstractMsgReceiver的信息接收者，并在里面处理相关信息，类PushMessageReceiver已展示。
	        GameService.registerMsgReceiver(PushMessageReceiver.class);
	        //进行推送服务的前必须为应用打上tag，tag可以任意的.
	        GameService.setPushTags(getApplicationContext(), new String[]{"demo"}, null);
	        GameService.startPushService(this);

+ push服务初始化及绑定
	+ 方法： GameService.**startPushService** (Context ctx) 
	+ 功能： 完成push服务的初始化工作，以及与MasterService的自动绑定工作。当masterService第一次启动完成登录操作。
	+ 参数： ctx 当前执行的上下文。

+ push 服务的停止
	+ 方法： GameService.**stopPushService**(Context ctx)	+ 功能： 停止当前应用的push服务，以及与MasterService 的解绑操作。
	+ 参数： ctx 当前上下文

+ 设置Tags
	+ 方法： GameService.**setPushTags** (Context context,String[] tags,String charset)
	+ 功能： 为App进行属性标注，最大标签数100，使用时必须使用一致的charset，cid不能作为tag使用
	+ 参数 
		 + tags 你当前需要的标签集合
		 + charset 当前tags 的编码格式，不设置默认为‘UTF-8‘
+ p2p消息发送（用于游戏内一个玩家给另外一个玩家发送消息）
	+ 方法： GameService.**sendMsg** (Context context, String fromPlayerId, String toPlayerId, String msg)
	+ 功能： 用于游戏内一个玩家给另外一个玩家发送消息
	+ 参数 
		 + context 内容上下文
		 + fromPlayerId 发送者的id（注：此id必须之前调用过GameService.onPlayerLogin(context, PLAYER_ID)保证在服务端已成功注册）
		 + toPlayerId 信息接收用户id（注：此id必须之前调用过GameService.onPlayerLogin(context, PLAYER_ID)保证在服务端已成功注册）		 
+ 获取tuid（用于精确推送）
	+ 方法： GameService.**getTuid** (Context context)
	+ 功能： 获取tuid，可用于精确推送
	+ 参数 
		 +  context 内容上下文
		
#####AbstractMsgReceiver（消息接收父类）

| 分类        		| 功能           	| 方法  	               |
| -----------------	|-------------	| --------------------|
| push消息接口    	| 回调 push 消息		| onMessage          |
| 调试消息接口     	| 回调 debug 消息     	|   onDebug    |
| p2p消息接口        | 回调 p2p 消息     		|    onImReceive  |

+ 接收到的push消息
	+ 方法： public abstract void **onMessage**(String message)
	+ 功能： 接收到的push消息回调
	+ 参数： push 内容

+ 接收到的debug消息
	+ 方法： public void **onDebug**(String message)
	+ 功能： 获取设备ID
	+ 参数： debug 内容

+ 接收到的p2p消息
	+ 方法： public void **onImReceive**(String fromTuid,String toTuid,String message)
	+ 功能： 获取设备ID
	+ 参数
		+ fromTuid 发送消息的来源 Tuid
		+ toTuid   消息的目标	 Tuid
		+ message  p2p 消息内容
+ 注册消息接收者
	+ 方法： GameService.**registerReceiver**(Class<? extends AbstractMsgReceiver> clzz)
	+ 功能： 为App注册消息接收接口。
	+ 参数： 消息处理类
	
+ 反注册消息接收者
	+ 方法： GameService.**unRegisterReceiver**()
	+ 功能： 为App反注册消息接收者。
	

**如果要保证能正常接收消息一定要在代码中实现继承AbstractMsgReceiver并做以下调用正常开启推送服务，内容在PushServiceActivity中：**



	GameService.registerMsgReceiver(PushMessageReceiver.class);
	        GameService.setPushTags(getApplicationContext(), new String[]{"your tag"}, null);//设置标签为可选项
	        GameService.startPushService(this);


## 四、相关类介绍

### 4.1 回调函数类

        // 支付回调
        public static interface OnPayListener {
            void finish(int code, String msg);
        }

        // 登陆回调
        public static interface OnLoginListener {
            void finish(int code, OAuthInfo authInfo);
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
	
	    public static final String GRANT_TYPE_SNS_TOKEN = "sns_token";
	
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
### 密钥生成命令
	// 生成RSA私钥
	openssl>genrsa -out rsa_private_key.pem 1024
	
	// 生成RSA公钥
	openssl>rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
	
	// 将RSA私钥转换成PKCS8格式
	openssl>pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM -nocrypt
	
* 注意：“>”符号后面的才是需要输入的命令。

### 需要参与签名的参数

* 在请求参数列表中，除去sign、payment参数外，其他需要使用到的参数皆是要签名的参数。
* 在服务器异步通知参数列表中，除去sign参数外，凡是通知返回回来的参数皆是要验签的参数。


### 生成待签名字符串

对于如下的参数：

    {
        "body": "【2元包邮】韩版 韩国 流行饰品太阳花小巧雏菊 珍珠项链2M15",
        "subject": "珍珠项链 【2元包邮】韩版 韩国 流行饰品太阳花小巧雏菊 珍珠项链2M15",
        "amount": 2,
        "app_user_name": "角色名",
        "app_id": "1",
        "app_order_id": "201404250461774836",
        "imei": "447769804451095",
        "ext": "",
        "notify_url": "http://127.0.0.1/pay/test",
        "app_user_id": "123",
        "mac_address": "05-16-DC-59-C2-34",
        "bind_id": "6306",
        "channel_id": "test",
        "sign": ""
    }
去掉sign参数，将其他参数按照字母顺序升序排列，再把所有数组值以“&”字符连接起来：

amount=2&app_id=1&app_order_id=201404250461774836&app_user_id=123&app_user_name=角色名&bind_id=6306&body=【2元包邮】韩版 韩国 流行饰品太阳花小巧雏菊 珍珠项链2M15&channel_id=test&imei=447769804451095&mac_address=05-16-DC-59-C2-34&notify_url=http://127.0.0.1/pay/test&subject=珍珠项链 【2元包邮】韩版 韩国 流行饰品太阳花小巧雏菊 珍珠项链2M15
即为待签名字符串。 

注意：没有值的参数无需传递，也无需包含到待签名数据中；

### RSA签名

在RSA的签名时，需要私钥和公钥一起参与签名。私钥与公钥皆是客户通过OPENSSL来生成得出的。客户把生成出的公钥与新游平台技术人员配置好的新游公钥做交换。因此，在签名时，客户要用到的是客户的私钥及新游的公钥。 

* 请求时签名 当拿到请求时的待签名字符串后，把待签名字符串与客户的私钥一同放入RSA的签名函数中进行签名运算，从而得到签名结果字符串。

* 通知返回时验证签名 当获得到通知返回时的待签名字符串后，把待签名字符串、新游提供的公钥、新游通知返回参数中的参数sign的值三者一同放入RSA的签名函数中进行非对称的签名运算，来判断签名是否验证通过。

* 签名函数 RSA sign + base64 encode

## 六、代码混淆

GameService的SDK 包是以 jar 包及资源文件提供给用户的,您在混淆自己 APK 包的时候请不要将 GameService 的 jar 包一起混淆, 若被混淆后会因为无法找到相关类而抛异常。
您可以在用 ant 构建混淆包的 build.xml 里面对应位置或者在工程的混淆配置文件里加入:
        
-libraryjars libs/\*.jar   
-keep class com.gameservice.sdk.\*\*  
-keep class com.tgx.push.\*\*  
-keep class com.alipay.\*\*
        
以避免GameService的相关的 jar 包被混淆。




	         