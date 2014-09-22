# NGPushService iOS SDK 说明文档 V1.0.0
<a href="../../static/download/NGPushService_iOS_SDK V1.0.0zip" target="_blank" class="sdk-download">下载iOS SDK</a>

##更新履历
版本号| 时间| 更新内容
----|-----|--------
v1.0.0|2014.09.19|SDK正式版发布

## 1、SDK构成
1. 静态库 libNGPushServiceSDK.a, libNGPushServiceSDK-arm64.a
2. 头文件: NGPushService.h, NGPushServiceDefines.h
3. Demo工程

NGPushService SDK支持armv7、armv7s和arm64架构的iOS设备，iOS要求5.0以上，Xcode要求4.2以上，操作系统要求Mac OS X 10.7以上。

* 如果需要支持arm64，请使用静态库libNGPushServiceSDK-arm64.a

## 2、项目配置

### 2.1 添加链接参数
在工程target的"Build Settings"中，找到"Linking"的"Other Linker Flags"，添加参数`-ObjC`。
![](./sdk-files/linker.png)
### 2.2 添加Framework
在工程target中添加以下的framework:

	SystemConfiguration.framework
	CoreTelephony.framework
	UIKit.framework

![image](./sdk-files/add_frameworks.png)

### 2.3 添加NGPushService
1. 将NGPushServiceSDK文件夹拖入Xcode工程.

2. 在项目target的"build settings"中，找到"Search Paths"的"Library Search Paths", 如果NGPushServiceSDK的路径是绝对路径的，请改为相对路径。
	![image](./sdk-files/library_path.png)
	
## 3、SDK使用

### 3.1 配置推送证书(已经有p12证书的可以跳过这一步)

详见[APNS证书创建流程](http://docs.gameservice.com/docs/other/Create_APNG_Certificate.html)。

### 3.2 上传推送证书到GameService

* 登录GameService开发者后台；
* 在**游戏管理**页面，在对应游戏的那一行上点击**编辑**按钮进入编辑界面；
* 点击**开发环境APNS证书**打开文件选择框，选择p12证书并上传；

### 3.3 初始化SDK
AppID和AppKey请到[GameService 开发网站](http://developers.gameservice.com/)后台查看获取，需要先创建App。

初始化需要设置AppID和AppKey：

	[NGPushService setAppID:@"10057" AppSecret:@"n6tE8Nr0TRrxkxovOd4btirTyR8J3Ku6"];
	
### 3.4 获取并上传device token
请求device token:

	[[UIApplication sharedApplication] registerForRemoteNotificationTypes:UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound];

在UIApplicationDelegate中获取device token，上传到GameService：
	
	- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [NGPushService setPushToken:deviceToken]; //上传device token
	}


如果无法获取到到device token，请在`application:didFailToRegisterForRemoteNotificationsWithError:`中查看错误原因：

	- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    NSLog(@"%@", error);
	}
### 3.5 使用SDK

设置登录玩家ID，必填，在pushToken设置之后，玩家登录完成时调用此接口。如果游戏不存在玩家ID，则设置为"0"：

	[NGPushService setLoginPlayerID:@"123"];

设置渠道ID (可选)：

	[NGPushService setChannelID:@"14"];
	
统计支付：

	NGPaymentRecord *paymentRecord = [[NGPaymentRecord alloc] init];
	paymentRecord.player_id = @"123";
	paymentRecord.channel_id = @"14"; //渠道ID，可不填
	paymentRecord.amount = 100;
	paymentRecord.payment_channel = @"test";
	paymentRecord.currency = @"人民币";
	paymentRecord.coin_amount = 1000;
	paymentRecord.order_id = @"201409190001";
	paymentRecord.level = 50;
	paymentRecord.server_id = @"2";
	[NGPushService pay:paymentRecord];

统计玩家进入某个等级，在玩家升级之后或者登录游戏(在`UIApplicationDidBecomeActiveNotification`消息处理函数中判断玩家是否登录，登录则调用)之后调用：

	NGLevelRecord *levelRecord = [NGLevelRecord new];
	levelRecord.player_id = @"123";
	levelRecord.channel_id = @"14"; //渠道ID，可不填
	levelRecord.server_id = @"2";
	levelRecord.player_level = 50;
	[NGPushService reachLevel:levelRecord];
	
统计玩家离开某个等级，在玩家升级之前和退出游戏之前调用(在`UIApplicationWillResignActiveNotification`消息处理函数中判断玩家是否有等级，有等级则调用)：

	NGLevelRecord *levelRecord = [NGLevelRecord new];
	levelRecord.player_id = @"123";
	levelRecord.channel_id = @"14"; //渠道ID，可不填
	levelRecord.server_id = @"2";
	levelRecord.player_level = 50;
	[NGPushService leaveLevel:levelRecord];

* reachLevel:和leaveLevel:配合使用，统计玩家在某个等级的在线时间。
	
统计玩家进入关卡：

	NGMissionRecord *missionRecord = [NGMissionRecord new];
	missionRecord.player_id = @"123";
	missionRecord.channel_id = @"14"; //渠道ID，可不填
	missionRecord.server_id = @"2";
	missionRecord.mission_id = 11;
	[NGPushService enterMission:missionRecord];
	
统计玩家离开关卡，在玩家离开关卡或者退出游戏时调用：
	
	NGMissionRecord *missionRecord = [NGMissionRecord new];
	missionRecord.player_id = @"123";
	missionRecord.channel_id = @"14"; //渠道ID，可不填
	missionRecord.server_id = @"2";
	missionRecord.mission_id = 11;
	[NGPushService leaveMission:missionRecord];
	
统计玩家消费行为：

	NGConsumptionRecord *consumptionRecord = [NGConsumptionRecord new];
	consumptionRecord.player_id = @"123";
	consumptionRecord.channel_id = @"14"; //渠道ID，可不填
	consumptionRecord.server_id = @"2";
	consumptionRecord.item_id = 1000;
	consumptionRecord.item_amount = 1;
	consumptionRecord.coin_amount = 100;
	[NGPushService consumption:consumptionRecord];
	
统计玩家剩余虚拟币：

	NGCoinRecord *coinRecord = [NGCoinRecord new];
	coinRecord.player_id = @"123";
	coinRecord.channel_id = @"14"; //渠道ID，可不填
	coinRecord.server_id = @"2";
	coinRecord.coin_amount = 90000;
	[NGPushService coin:coinRecord];