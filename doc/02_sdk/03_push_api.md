### HTTP返回码

- 200 成功
- 其他 失败

### HTTP 接口返回值结构

    {
        "meta": 
        {
            "code": "业务码",
            "message": "状态信息"
        },
        "pagination": 
        {
            "rows_found": "找到的总记录数",
            "offset": "起始游标",
            "since": "往此游标向后追溯",
            "until": "往此游标向前追溯",
            "limit": "条数"
        },
        "data": ...
    }
    
### 第三方服务端授权
- 请求地址: 所有可供第三方服务端访问的接口
- 请求头部: Authorization: Basic xxx  //xxx 为 base64.encode("<client_id>:<client_secret>")生成的字符串

### apns推送
- 请求地址：**POST /gc1/push/ios/sandbox/&lt;int:client_id&gt;**
- 请求地址：**POST /gc1/push/ios/&lt;int:client_id&gt;**
- 是否认证：是
- 请求内容：

        {
            "alert":"消息内容",
            "badge":"角标数字 可选",
            "sound":"声音文件 可选(默认default)"
        }
        
- 成功响应 200

- 操作失败:
状态码:400

        | 错误码       |  错误消息                  |
        | --------- |:---------------------------:| 
        | 6011       |  非法的clientid             |        
        | 6009       |  post的内容为空             |  
        | 6010       |  非法的json对象             |
        

### android推送
- 请求地址：**POST /gc1/push/android/&lt;int:client_id&gt;**
- 是否认证：是
- 请求内容：


        {
            "push_type":"通知类型",
            "order_time":"定时推送时间(可空) 格式为yyyy-MM-dd HH:mm:ss"
            "log_encode":"",
            "title":"通知栏标题",
            "content":"通知栏内容",
            "stat_image":"通知栏小图标，当不设置时为系统应用图标（小机器人），可设置为sdk预置的小图标",
            "logo_path":"通知栏图标（使用应用内的图标）",
            "logo_url":"通知栏图标（使用网络图片）",
            "is_clearable":"是否可清除",
            "is_vibrate":"是否震动",
            "is_ring":"是否有响铃",
            "tag_ids":["1", "2",...],


            //通知栏－启动应用 push_type == 1
            "app_params":
                {
                    "key":"value",
                    ...
                }

            //通知栏-弹出框-下载 push_type == 2
            "popup_title":"弹出框的标题",
            "popup_content":"弹出框的内容",
            "popup_image_path":"弹出框图片",
            "popup_icon_path":"弹出框中的Icon图片",
            "btn1_name":"默认左边按钮的名称",
            "btn2_name":"默认右边按钮的名称",
            "down_url":"下载的文件地址",
            "md5":"用于鉴定的文件的MD5值（可不填写）",
            "file_name":"文件的名称，带后缀",

            //通知栏—打开网页 push_type == 3
            "web_url":"打开网址的地址",
    
            //通知栏-启动应用的特定页面 push_type == 4
            "app_params":
                {
                    "key":"value",
                    ...
                }
            "active_page":"要转的页面",
        }

        
- 成功响应 200

- 操作失败:
状态码:400

        | 错误码       |  错误消息                  |
        | --------- |:---------------------------:| 
        | 6011       |  非法的clientid             |        
        | 6009       |  post的内容为空             |  
        | 6010       |  非法的json对象             |
        | 6004       |  必须指定app的启动页面       |
        | 6003       |  必须指定打开的网站地址      |
        | 6005       |  必须指定下载的url          |
        | 6006       |  弹出框内容为空             |
        | 6007       |  错误的通知类型             |
        

### 推送记录
- 请求地址：**GET /push/records/<int:client_id\>**
- 请求参数: offset=开始记录数&limit=获取记录数&push_channel={}&push_type={}&pushed_status={}
- 参数说明：
* push_type 传5为消息，传-5为通知
- 是否认证：是，客户端认证
- 成功响应：

        {
            "pagination": {
                "rows_found": "总记录数,整型",
                "limit": "获取记录数，整型",
                "offset": "开始记录数，整型"
            },
            "meta": {},
            "data": [
                {
                    "title": "内容标题，字符串",
                    "push_channel": "来源，0 广播 1 精确推送",
                    "order_time": "发送时间戳，整型",
                    "push_type": "推送类型，1-4 通知(1打开应用,2下载应用,3打开网页,4打开应用指定页面),5 消息",
                    "send_count": "发送数量，整型",
                    "pushed_status": "发送状态，1 发送 0 未发送",
                    "platform_id": "平台ID 1 Android， 2 iOS",
                    "developer_id": "开发者ID，整型",
                    "create_time": "创建时间戳，整型",
                    "client_id": "客户端ID，整型",
                    "id": "通知ID，整型",
                    "content": { // 通知内容
                      <Android> 或 <iOS> // 字段为apns推送或android推送的输入参数定义，可只传有值的项目
                    },
                    "rule": {
                        "update_time": "更新时间戳，整型",
                        "name": "规则名称，字符串",
                        "enable": "是否启用，整型",
                        "items": { // 规则字段
                            "channel_id": 1
                        },
                        "developer_id": "开发者ID，整型",
                        "create_time": "创建时间戳，整型",
                        "id": "规则ID，整型",
                        "platform_id": "平台ID，整型"
                    }
                }
            ]
        }

- 操作失败:
状态码:400

错误码 错误消息

1001 client不存在

### 推送报表
- 请求地址：**GET /push/statistic/<int:client_id\>**
- 说明： 只有android支持推送报表
- 请求参数: begin_date=开始日期(2014-05-01)&end_date=结束日期(2014-05-02)
- 是否认证：是，客户端认证
- 成功响应：

        {
            "meta": {},
            "data": [
                {
                    "received": "接收数，整型",
                    "received_rate": "接收率，浮点型，已乘以100",
                    "received_15m_rate": "15分钟接收率，浮点型，已乘以100",
                    "received_15m": "15分钟接收数，整型",
                    "date": "日期，格式：2014-09-08",
                    "sent": "发送数，整型"
                }
            ]
        }

- 操作失败:
状态码:400

错误码 错误消息

1001 client不存在

