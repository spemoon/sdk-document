
# 服务端接入 说明文档_V1.0.0 

<a href="../../static/download/sdk_server_demo_v1.0.zip" target="_blank" class="sdk-download">下载服务端SDK</a>


## 环境
目前接入环境都是正式环境，接口请求地址前都需要加上环境。

- 正式环境：[ https://api.gameservice.com ](/ "正式环境")

### SDK测试:

- APP_ID = 8  # android
- APP_SECRET = 'sVDIlIiDUm7tWPYWhi6kfNbrqui3ez44'

- APP_ID = 9  # ios
- APP_SECRET = '0WiCxAU1jh76SbgaaFC7qIaBPm2zkyM1'

- CHANNEL_ID = 14

## 验证获取用户信息

- 请求地址: **GET /gc1/oauth2/token_info**
- 是否认证: 是，在HTTP头需要设置Authorization: Bearer {{access_token}}
    {{access_token}} 代表从客户端获取的access_token
- 成功响应:

        //HTTP状态码200
        
        {
            "data":
            {
                "id": "用户id,长整型",
                "name": "用户名（全局唯一），字符串",
                "nick_name": "昵称，字符串",
                "ctime": "创建时间戳，整型",
                "avatar_url": "头像地址，字符串"
            }
        }

- 失败响应：

	1.HTTP状态码403,错误只有1种，没有权限，响应如下：
        
        {
            "meta":
            {
                "code": 403 # 没有权限
            }
        }
        
	2.HTTP状态码400，错误有2种，grant type错误 或 账号不存在，响应如下：
        
        {
            "meta":
            {
                "code": 1002,
                "message": "grant type错误"
            }
        }

        
| code |  message      |
| ----| -------------|
|1002  | grant type错误 |
|2002  | 账号不存在      |


## 开发者服务器回调
- 请求地址：**POST {{生成订单传的notify_url}} **

    {{生成订单传的notify_url}} 表示在生成订单时客户端提交的回调地址

- 请求内容：


    subject=测试商品名称&body=测试商品名称&app_user_id=0WiCxAU1jh76SbgaaFC7qIaBPm2zkyM1&app_user_name=角色名&app_id=9&amount=10&order_id=20140715139304463057&app_order_id=1405394642&status=STATUS_SUCCESS&create_time=1405394603&payment_time=0&notify_time=0&sign=ipeVRi2oBfXWDdQ77GUEzGUTl+jQxivFbyqfcCLKz9ht+j1tLO7WxHqfbRYQ+wAboALIcMY8JQgdLXamHNc7wekvjk+fwSzXTfq1too4MOAKKcvEoKKZGijwzKVR5b+fEwR+pIAyY/F5lc+6zMq5YOZeSEWRVUEVwgOmGREMF04=
    
- 字段说明

        "subject": "商品名,字符串",
        "body": "商品描述,字符串",
        "app_user_id": "应用用户ID,字符串",
        "app_user_name": "应用用户名,字符串",
        "app_id": "应用ID,字符串",
        "amount": "价格，单位分,整型",
        "order_id": "平台订单号,字符串",
        "app_order_id": "应用订单号,字符串",
        "status": "订单状态，STATUS_SUCCESS 或 STATUS_FAIL",
        "create_time": "创建UTC时间戳，整型",
        "payment_time": "支付UTC时间戳，整型",
        "notify_time": "通知UTC时间戳，整型",
        "ext": "扩展信息，开发者选填，空时不传",
        "sign": "签名，字符串",

- 成功响应：
    根据status判断是否STATUS_SUCCESS，是处理相关业务后，直接输出 success，业务处理失败输出fail
- 失败响应:
    除了success以外，都认为是失败

## 签名机制
###  需要参与签名的参数
- 在请求参数列表中，除去sign、payment参数外，其他需要使用到的参数皆是要签名的参数。
- 在服务器异步通知参数列表中，除去sign参数外，凡是通知返回回来的参数皆是要验签的参数。
### 生成待签名字符串
生成订单待签名字符串生成

对于如下的参数数组：

    subject=测试商品名称&body=测试商品名称&app_user_id=0WiCxAU1jh76SbgaaFC7qIaBPm2zkyM1&app_user_name=角色名&app_id=9&amount=10&order_id=20140715139304463057&app_order_id=1405394642&status=STATUS_SUCCESS&create_time=1405394603&payment_time=0&notify_time=0&sign=ipeVRi2oBfXWDdQ77GUEzGUTl+jQxivFbyqfcCLKz9ht+j1tLO7WxHqfbRYQ+wAboALIcMY8JQgdLXamHNc7wekvjk+fwSzXTfq1too4MOAKKcvEoKKZGijwzKVR5b+fEwR+pIAyY/F5lc+6zMq5YOZeSEWRVUEVwgOmGREMF04=

去掉sign参数，将其他参数按照字母顺序升序排列，再把所有数组值以“&”字符连接起来：
    
    amount=10&app_id=9&app_order_id=1405394642&app_user_id=0WiCxAU1jh76SbgaaFC7qIaBPm2zkyM1&app_user_name=角色名&body=测试商品名称&create_time=1405394603&notify_time=0&order_id=20140715139304463057&payment_time=0&status=STATUS_SUCCESS&subject=测试商品名称

即为待签名字符串。
注意：

* 没有值的参数无需传递，也无需包含到待签名数据中；

### RSA签名
在RSA的签名时，需要私钥和公钥一起参与签名。私钥与公钥皆是客户通过OPENSSL来生成得出的。客户把生成出的公钥提交到开发者平台与新游平台的新游公钥做交换。因此，在签名时，客户要用到的是客户的私钥及新游的公钥。


* RSA密钥生成命令

        生成RSA私钥
        
        openssl>genrsa -out rsa_private_key.pem 1024
        
        生成RSA公钥
        
        openssl>rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
        
        将RSA私钥转换成PKCS8格式
        
        openssl>pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM -nocrypt
        
        注意：“>”符号后面的才是需要输入的命令。


*请求时签名
当拿到请求时的待签名字符串后，把待签名字符串与客户的私钥一同放入RSA的签名函数中进行签名运算，从而得到签名结果字符串。

*通知返回时验证签名
当获得到通知返回时的待签名字符串后，把待签名字符串、新游提供的公钥、新游通知返回参数中的参数sign的值三者一同放入RSA的签名函数中进行非对称的签名运算，来判断签名是否验证通过。

*签名函数
 RSA sign + base64 encode
 
 具体实现见范例代码。
 
例如上例中签名结果为

    ipeVRi2oBfXWDdQ77GUEzGUTl+jQxivFbyqfcCLKz9ht+j1tLO7WxHqfbRYQ+wAboALIcMY8JQgdLXamHNc7wekvjk+fwSzXTfq1too4MOAKKcvEoKKZGijwzKVR5b+fEwR+pIAyY/F5lc+6zMq5YOZeSEWRVUEVwgOmGREMF04=
    