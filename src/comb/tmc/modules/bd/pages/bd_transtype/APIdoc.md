# 交易类型接口文档

## 接口规范
请求和返回的数据格式都是json，并采用请求签名校验的交互方式，请求方式主要采用POST。

### 1.1 接口说明
- 所有的接口都遵循上面的交互格式，这样设计的目的主要是为了接口安全，后台可以快速定位到相关接口的问题并进行处理。
- 字段名采用驼峰命名规范。

## 接口明细
### 2.1 交易类型页面查询接口
- 请求地址：`bd/transtype/search`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| maincategory      | Number  | 是 |主类型如：2（投资品种）、1（融资品种）、3（费用项目）、4（银行交易项目）|
| parentid     | String      |   否 |点击处id

- 请求示意：

```json
{
    "maincategory" : 2,
    "parentid" : "224224"
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
| head     | JSON   |   是 |相关区域数据对象|
| rows     | Array      |   是 |数据数组|
| values     | JSON    |   是 |字段对象|
| id    | JSON       |   是 |key|
| name    | JSON       |   是 |页面上显示的值|
| type    | JSON       |   是 |数据类型，预置数据(1),非预置数据(0)|

- 响应示意：

```json
{
  "data" : {
      "head":  {
          "pageInfo": null,
          "rows": [
              {
                  "rowId": "0",
                  "values": {
                      "id": {
                          "display": null,
                          "scale": -1,
                          "value": "224224"
                      },
                      "name": {
                          "display": null,
                          "scale": -1,
                          "value": "定期存款"
                      },
                      "type": {
                          "display": null,
                          "scale": -1,
                          "value":  1
                      }
                  }
              },
              {
                  "rowId": "1",
                  "values": {
                      "id": {
                          "display": null,
                          "scale": -1,
                          "value": "2244"
                      },
                      "name": {
                          "display": null,
                          "scale": -1,
                          "value": "自定义大类1"
                      },
                      "type": {
                          "display": null,
                          "scale": -1,
                          "value":  0
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

### 2.2 交易类型页面新增接口
- 请求地址：`bd/transtype/add`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| maincategory      | JSON  | 是 | 主类型，value值如：2（投资品种）、1（融资品种）、3（费用项目）、4（银行交易项目）|
| sencdcategory     | JSON  |  是 |子类型，value值如：1（交易大类）、2（交易类型）、3（事件）|
| name     | JSON      |   是 | 新增数据，value值为页面上显示的数据 |


- 请求示意：

```json
{
	"data": {
		"head": {
			"pageInfo": null,
			"rows": [
				{
					"rowId": "6",
					"status": 2,
					"values": {
					     "maincategory" : {
                             "value": 2
					     },
					     "sencdcategory" : {
                             "value": 2
					     },
						 "name": {
                             "value": "自定义类型2"
                         }
                    }
				}
			]
		}
	}
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|error|Obj|是|对象结构,后台具体描述
| data     | null     |   是 ||


- 响应示意：

```json
{
    "data" : null,
    "error":null,
    "success": true
}
```


### 2.3 交易类型页面删除接口
- 请求地址：`bd/transtype/delete`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| maincategory      | JSON  | 是 | 主类型，value值如：2（投资品种）、1（融资品种）、3（费用项目）、4（银行交易项目）|
| id    | JSON      |   是 | 删除数据的Id |


- 请求示意：

```json
{
	"data": {
		"head": {
			"pageInfo": null,
			"rows": [
				{
					"rowId": "6",
					"status": 3,
					"values": {
					     "maincategory" : {
                             "value": 2
                         },
						 "id": {
                             "value": "2244"
                         }
                    }
				}
			]
		}
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
    "data" : null,
    "error":null,
    "success": true
}
```



### 2.4 交易类型页面修改接口
- 请求地址：`/bd_transtype/edit`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| maincategory      | JSON  | 是 | 主类型，value值如：2（投资品种）、1（融资品种）、3（费用项目）、4（银行交易项目）|
| id    | JSON      |   是 | 修改数据的Id |
| name     | JSON      |   是 | 修改后的数据，value值为页面上显示的数据 |

- 请求示意：

```json
{
	"data": {
		"head": {
			"pageInfo": null,
			"rows": [
				{
					"rowId": "6",
					"status": 1,
					"values": {
					     "maincategory" : {
                             "value": 2
					     },
					     "id" : {
                             "value": "2244"
					     },
						 "name": {
                             "value": "自定义类型1"
                         }
                    }
				}
			]
		}
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
    "data" : null,
    "error":null,
    "success": true
}
```
