# 金融网点接口文档

## 接口规范
请求和返回的数据格式都是json，并采用请求签名校验的交互方式，请求方式主要采用POST。

### 1.1 接口说明
- 所有的接口都遵循上面的交互格式，这样设计的目的主要是为了接口安全，后台可以快速定位到相关接口的问题并进行处理。
- 字段名采用驼峰命名规范。

## 接口明细
### 2.1 金融网点页面查询接口
- 请求地址：`/finbank/search`
- 请求方式：`POST`
- 请求参数：

|字段     |	中文名称     |类型         |是否必须 |     说明
|--------------|--------------|-------------|---------|--------------|
|  fincode  |	金融机构  | String      |   否 |  是下拉枚举还是下拉档案待定	|
|  province  |	省份  | String      |   否 | 省份名称	|
|  city  |	城市  | String      |   否 | 城市名称 	|
|  keywords  |	关键字  | String      |   否 |  模糊匹配（为"金融机构"字段的模糊匹配）	|


- 请求示意：

```json
{
	pageIndex,
	pageSize,
	keyWords, 
	"part": {
		"fincode":"value",
		"province":"value",
		"city":"value",
		"keyword":"value"
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
| error | String | 是 | 错误信息（成功则为 null ）
| data     | Array      |   是 |相关数据集|

- data示意：

|字段          |类型         |是否必须 |     中文名称	 |	备注
|--------------|-------------|---------|------------|------------|
| financeid      | String       | 是 | 金融机构ID | 参照 |
| id      | String       | 是 | 金融网点ID | 新增后端生成 |
| code      | String       | 是 | 金融网点编码 |  |
| name      | String       | 是 | 金融网点名称 |  |
| combinenum | String | 是 | 联行行号 | |
| swiftcode     | String      |   是 | Swift代码 |  |
| province     | String      |   是 | 省 | 省名称，如"河北" |
| city     | String      |   是 | 市| 市名称，如"北京" |
| phone     | String      |   是 | 电话 | |
| address     | float      |   是 | 地址 |  |

- 响应示意：

```json
{
	"data": {
		"pageInfo": null,
		"rows": [
			{
				"rowId": "0",
				"values": {
					"finbankid": {
						"display": "10000z600548401",
						"scale": -1,
						"value": "10000z600548401"
					},
					"combinenum": {
						"display": "4045671258",
						"scale": -1,
						"value": "4045671258"
					},
					"finbankname": {
						"display": "中国工商银行",
						"scale": -1,
						"value": ""
                    }
                    ...
				}
			},
			{
				"rowId": "1",
				"values": {
					"finbankid": {
						"display": "10000z6005484MJ",
						"scale": -1,
						"value": "10000z600548MJ"
					},
					"combinenum": {
						"display": "10027884515",
						"scale": -1,
						"value": "10027884515"
                    }
                    ...
				}
            }
            ...
		]
	},
	"error": null,
	"success": true
}
```

### 2.2 金融网点页面修改保存接口
- 请求地址：`/finbank/save`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| data  |  JSON   |  是  |  保存的数据对象  |

- 请求示意：

```json
{
	"financeid": "10000z600548401",
	"combinenum": "9564567887",
	"swiftcode": "885748456",
	...
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
  "data" : "添加成功！",
  "error":null,
  "success": true
}
```

### 2.3 金融网点页面新增保存接口
- 请求地址：`/bd_bankaccbas/finbankadd`
- 请求方式：`POST`
- 请求参数：

预留银行账户档案中，参照新增保存金融网点接口


### 2.4 金融网点页面删除接口
- 请求地址：`/finbank/delete`
- 请求方式：`POST`
- 请求参数：

未使用的金融网点记录可以删除，后端校验

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| rateid     | String      |   是 |删除选中的金融网点记录|


- 请求示意：

```json
{
    "id" : "value"
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
  "data" : "删除成功！",
  "error":null,
  "success": true
}
```
