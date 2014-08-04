# APNS证书创建流程

<!-- create time: 2014-08-01 13:33:00  -->

## 1 创建iOS App ID, 如果已经存在跳到步骤2
1 登录Apple Developer Center，选择Identifiers下的App IDs，点击添加:

![image](./01_Create_APNG_Certificate/1.png)

2 填写App ID Description:

![image](./01_Create_APNG_Certificate/2.png)

3 填写bundle ID:

![image](./01_Create_APNG_Certificate/3.png)

4 选中**Push Notification**, 点击继续:

![image](./01_Create_APNG_Certificate/4.png)

5 提交:

![image](./01_Create_APNG_Certificate/5.png)


## 2 创建推送证书

这里以开发证书为例，发布证书步骤相同

6 打开Keychain， 点击菜单**"证书助理"** -> **"从证书颁发机构请求证书"...**:

![image](./01_Create_APNG_Certificate/6.png)
![image](./01_Create_APNG_Certificate/7.png)

7 填写邮箱，常用名称，选择保存到磁盘，继续:

![image](./01_Create_APNG_Certificate/8.png)

8 回到Apple Developer Center，在App ID列表上点击展开需要创建证书的App ID，点击**edit**

![image](./01_Create_APNG_Certificate/9.png)

9 点击创建证书:

![image](./01_Create_APNG_Certificate/10.png)

10 点continue继续:

![image](./01_Create_APNG_Certificate/11.png)

11 选择刚刚创建的certSigningRequest文件:

![image](./01_Create_APNG_Certificate/12.png)

12 点击"Generate"生成:

![image](./01_Create_APNG_Certificate/13.png)

13 下载生成的证书，并双击安装:

![image](./01_Create_APNG_Certificate/14.png)

14 打开keychain，就可以看到生成的证书:

![image](./01_Create_APNG_Certificate/15.png)

## 3 导出证书
15 在keychain中，点击安装好的证书，右键弹出菜单：

![image](./01_Create_APNG_Certificate/16.png)

16 点击导出p12文件：

![image](./01_Create_APNG_Certificate/17.png)



