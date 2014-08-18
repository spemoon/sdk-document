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


### 获取应用的tag
- 请求地址：**POST /gc1/push/android/&lt;int:client_id&gt;/tags**
- 是否认证：是
- 成功响应:

        [
            {
                "id":"tag的ID",
                "tag":"tag名称",
                "create_time":"创建时间戳",
            }
        ]
        
- 操作失败:
状态码:400


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


### 在时间区间内，统计某个应用的下发 回执 和离线回执情况
- 请求地址：**GET /gc1/push/android/receipt/&lt;int:client_id&gt;?begin_date={yyyy-mm-dd}&end_date={yyyy-mm-dd}**
- 是否认证：是
- 请求内容：
    
* begin_date  开始日期，yyyy-mm-dd格式，默认为今天
* end_date 结束日期，yyyy-mm-dd格式，默认为今天

        
- 成功响应: 200

        [
            {
                "reciver": "一天的发送总量, int",
                "offline": "一天离线接收的总量, int",
                "send": "一天的发送总量, int",
                "time":  "日期，yyyy-mm-dd格式"
            },
            ...
        ]

    
- 操作失败:
状态码:400


### 分页查询应用的发送情况，时间为倒叙
- 请求地址：**GET /gc1/push/android/send_info/&lt;int:client_id&gt;?pushed_status=0&title=&offset=0&limit=20**
- 是否认证：是
- 请求内容：
* pushed_status: 查询任务的状态1:已发送 2：未发送; 0:全部
* title 推送的标题作为查询条件, 需要URLencode
* offset 起始游标, 默认 0
* limit 条数， 默认 20
        
- 成功响应 200

        {
            "pagination": {
                "rows_found": "总记录数"
                "limit": "条数"
                "offset": "起始游标"
            },
            "data": [
                {
                    "push_channel": "该任务的被创建的来源渠道：0:普通（内部接口创建） 1：pushrule自动推送；2：接口（第三方推送",
                    "task_id": "任务ID，long",
                    "send": "该任务的发送量, int",
                    "content": "任务的标题, String",
                    "reciver": "该任务在线接收量, int",
                    "is_sended": "该任务的是否已经下发了, bool",
                    "send_time": "任务下发的时间, long",
                    "offline": "该任务离线接收量, int"
                }
            ]
        }
        
- 操作失败:
状态码:400

