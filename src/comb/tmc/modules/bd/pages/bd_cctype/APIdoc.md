# 授信类别接口文档

## 接口规范
请求和返回的数据格式都是json，并采用请求签名校验的交互方式，请求方式主要采用POST。

### 1.1 接口说明
- 所有的接口都遵循上面的交互格式，这样设计的目的主要是为了接口安全，后台可以快速定位到相关接口的问题并进行处理。
- 字段名采用驼峰命名规范。

## 接口明细
### 2.1 授信类别页面查询接口
- 请求地址：`/bd_cctype/search`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| pageIndex      | String       | 是 |页码|
| pageSize     | String      |   是 |每页的数据数|
| keyWords     | String      |   否 |查询关键字|

- 请求示意：

```json
{
    "pageIndex" : "0",
    "pageSize" : "10",
    "keyword": "0001"
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|error|Obj|是|对象结构,后台具体描述|
| data     | JSON      |   是 |后台返回的详细数据|

- data参数说明：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| rows     | Array      |   是 |数据列|
| id     | String      |   是 |授信类别pk|
| code     | String      |   是 |授信类别编码|
| name     | String      |   是 |授信类别名称|
| creator     | String      |   是 |创建人名称|
| createdTime     | String      |   是 |创建时间|

- 响应示意：

```json
{
    "data" : {
        "head" : {
            "rows":  [
                {
                    "rowId" : 0,
                    "status" : 0,
                    "values": {
                        "id" : {
                            "display" : null,
                            "scale" : -1,
                            "value" : "1001K71000000000014U"
                        }, 
                        "code" : {
                            "display" : "0001",
                            "scale" : -1,
                            "value" : "0001"
                        },
                        "name" : {
                            "display" : "授信类别1",
                            "scale" : -1,
                            "value" : "授信类别1"
                        },
                        "creator" : {
                            "display" : "szg",
                            "scale" : -1,
                            "value" : "人员pk"
                        },
                        "createdTime" : {
                            "display" : null,
                            "scale" : -1,
                            "value" : "2017-11-1"
                        }
                    }
                },
                {
                    "rowId" : 1,
                    "status" : 0,
                    "values": {
                        "id" : {
                            "display" : null,
                            "scale" : -1,
                            "value" : "1001K71000000000014V"
                        }, 
                        "code" : {
                            "display" : "0002",
                            "scale" : -1,
                            "value" : "0002"
                        },
                        "name" : {
                            "display" : "授信类别2",
                            "scale" : -1,
                            "value" : "授信类别2"
                        },
                        "creator" : {
                            "display" : "szg",
                            "scale" : -1,
                            "value" : "人员pk"
                        },
                        "createdTime" : {
                            "display" : null,
                            "scale" : -1,
                            "value" : "2017-11-1"
                        }
                    }
                }
            ]
    }
  },
  "error":null,
  "success": true
}
```

### 2.2 授信类别页面新增接口
- 请求地址：`/bd_cctype/add`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| code      | String       | 是 | 授信类别编码 |
| name     | String      |   是 | 授信类别名称 |

- 请求示意：

```json
{
    "data" : {
     "rows":  [
        {
            "rowId" : 0,
            "status" : 2,
            "values": { 
                "code" : {
                    "value" : "0001"
                },
                "name" : {
                    "value" : "授信类别1"
                }
            }
        }
     ]
  }
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|error|Obj|是|对象结构,后台具体描述
| data     | String      |   是 |添加成功提示|


- 响应示意：

```json
{
    "error":null,
    "success": true
}
```


### 2.3 授信类别页面删除接口
- 请求地址：`/bd_cctype/delete`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| id  |  String    |  是  |  删除数据的pk  |



- 请求示意：

```json
{
    "data" : {
     "rows":  [
        {
            "rowId" : 0,
            "status" : 3,
            "values": {
                "id" : {
                    "value" : "1001K71000000000014U"
                }
            }
        }
     ]
  }
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|error|Obj|是|对象结构,后台具体描述
| data     | String      |   是 |添加成功提示|


- 响应示意：

```json
{
    "error":null,
    "success": true
}
```



### 2.4 授信类别页面修改接口
- 请求地址：`/bd_cctype/edit`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| id       | String      | 是 | 授信类别pk   |
| code     | String      | 是 | 授信类别编码 |
| name     | String      | 是 | 授信类别名称 |



- 请求示意：

```json
{
    "data" : {
     "rows":  [
        {
            "rowId" : 0,
            "status" : 1,
            "values": {
                "id" : {
                    "value" : "1001K71000000000014U"
                }, 
                "code" : {
                    "value" : "0001"
                },
                "name" : {
                    "value" : "授信类别1"
                },
            }
        }
     ]
  }
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|error|Obj|是|对象结构,后台具体描述
| data     | String      |   是 |添加成功提示|


- 响应示意：

```json
{
    "error":null,
    "success": true
}
```
