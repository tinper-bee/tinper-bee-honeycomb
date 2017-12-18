# 还款方式接口文档

## 接口规范
请求和返回的数据格式都是json，并采用请求签名校验的交互方式，请求方式主要采用POST。

### 1.1 接口说明
- 所有的接口都遵循上面的交互格式，这样设计的目的主要是为了接口安全，后台可以快速定位到相关接口的问题并进行处理。
- 字段名采用驼峰命名规范。

### 1.2 参数定义

- 还本方式枚举：
|字段           |类型         
|--------------|-------------|
| 1       | 日      
| 2     | 月      
| 3         | 季度      
| 4     | 半年      
| 5         | 年      
| 6         | 到期一次还本      

- 付息方式枚举：
|字段           |类型         
|--------------|-------------|
| 1       | 日      
| 2     | 月      
| 3         | 季度      
| 4     | 半年      
| 5         | 年      
| 6         | 到期一次付息     
| 7         | 利随本清    

## 接口明细
### 2.1 还款方式页面接口
- 请求地址：`/bd_rate/repaymentmethod`
- 请求方式：`POST`
- 请求参数：

- 请求示意：

```json

```

- 响应参数：


|字段           |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| code         | String      |   是 |   利率编码|
| repayment     | String      |   是 |   还款方式名称|
| debtment         | String      |   是 |  还本方式   按年月日，半年，季度|
| interment     | String      |   是 |  付息方式   按年月日，半年，季度|
| paybackperiod         | Number      |   是 |   还本期间|
| interestperiod         | Number      |是 |   付息期间|
| interestday      | date      |   是 |  结息日 日期类型|
| debtdate          | date      |   是 |  还本开始日期 |
| interdate   | date      |   是 |   付息开始日期|
| creator         | String      |   是 |   创建人|
| creationtime     | date      |   是 |   创建日期|


- 响应示意：

```json
{
	"data": {
		"pageInfo": null,
		"rows": [
			{
				"rowId": "0",
				"values": {
					"code": {
						"display": "10546784461",
						"value": "10000z600548401"
					},
					"repayment": {
						"display": "还款方式名称",
						"value": "CRATE"
					},
					"debtment": {
						"display": "按年月日，半年，季度",
						"value": "2017-10-20 00:00:00"
                    }
                    "interment": {
						"display": "按年月日，半年，季度",
						"value": "2017-10-20 00:00:00"
                    }
          	        "paybackperiod": {
						"display": "213213",
						"value": "2017-10-20 00:00:00"
                    }
          	        "interestperiod": {
						"display": "654654",
						"value": "2017-10-20 00:00:00"
                    }
          	        "interdate": {
						"display": "2017-10-20",
						"value": "2017-10-20 00:00:00"
                    }
          	        "debtdate": {
						"display": "2017-10-20",
						"value": "2017-10-20 00:00:00"
                    }
                    "interdate": {
						"display": "2017-10-20",
						"value": "2017-10-20 00:00:00"
                    }
                    "creator": {
						"display": "岳峰",
						"value": "2017-10-20 00:00:00"
                    }
                    "creationtime": {
						"display": "2017-10-20",
						"value": "2017-10-20 00:00:00"
                    }
          ...
				}
			},
			{
				"rowId": "1",
				"values": {
					"code": {
						"display": "10546784461",
						"value": "10000z600548401"
					},
					"repayment": {
						"display": "还款方式名称",
						"value": "CRATE"
					},
					"debtment": {
						"display": "按年月日，半年，季度",
						"value": "2017-10-20 00:00:00"
                    }
                    "interment": {
						"display": "按年月日，半年，季度",
						"value": "2017-10-20 00:00:00"
                    }
          	        "paybackperiod": {
						"display": "213213",
						"value": "2017-10-20 00:00:00"
                    }
          	        "interestperiod": {
						"display": "654654",
						"value": "2017-10-20 00:00:00"
                    }
          	        "interdate": {
						"display": "2017-10-20",
						"value": "2017-10-20 00:00:00"
                    }
          	        "debtdate": {
						"display": "2017-10-20",
						"value": "2017-10-20 00:00:00"
                    }
                    "interdate": {
						"display": "2017-10-20",
						"value": "2017-10-20 00:00:00"
                    }
                    "founder": {
						"display": "岳峰",
						"value": "2017-10-20 00:00:00"
                    }
                    "creationdate": {
						"display": "2017-10-20",
						"value": "2017-10-20 00:00:00"
                    }
          ...
				}
			},


      ...
		]
	},
	"error": null,
	"success": true
}
```

### 2.2 利率管理页面新增保存接口
- 请求地址：`/bd_rate/repaymentmethodadd`
- 请求方式：`POST`
- 请求参数：


|字段           |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| code         | String      |   是 |   利率编码|
| repayment     | String      |   是 |   还款方式名称|
| debtment         | String      |   是 |  还本方式   按年月日，半年，季度|
| interment     | String      |   是 |  付息方式   按年月日，半年，季度|
| paybackperiod         | Number      |   是 |   还本期间|
| interestperiod         | Number      |是 |   付息期间|
| interestday      | date      |   是 |  结息日 日期类型|
| debtdate          | date      |   是 |  还本开始日期 |
| interdate   | date      |   是 |   付息开始日期|
| founder         | String      |   是 |   创建人|
| creationdate     | date      |   是 |   创建日期|

- 请求示意：

```json
{
	
		
			
					"values": "1212",
					
					"ratetype":"CRATE",
				
					"revisedate": "2017-10-20 00:00:00"
         
        
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

### 2.3 利率管理页面修改保存接口
- 请求地址：`/bd_rate/repaymentmethodupdata`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| data  |  JSON   |  是  |  保存的数据对象  |

- 请求示意：

```json
{
					"values": "1212",
					
					"ratetype":"CRATE",
				
					"revisedate": "2017-10-20 00:00:00"
         
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
  "data" : "修改成功",
  "error":null,
  "success": true
}
```


### 2.5 利率管理页面删除
- 请求地址：`/bd_rate/repaymentmethoddel`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| rateid     | String      |   是 |选中利率管理记录ID|


- 请求示意：

```json
{
    
      "rateid" : "id"
   
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|error|Obj|是|对象结构,后台具体描述
| data     | String      |   是 |返回查询的结果集(保存的变更记录都返回，按照变更日期排序)


- 响应示意：

```json
{
	"data":"删除成功",
	"error": null,
	"success": ture,
}
```
