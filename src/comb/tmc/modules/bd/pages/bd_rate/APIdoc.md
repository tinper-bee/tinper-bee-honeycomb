# 利率管理接口文档

## 接口规范
请求和返回的数据格式都是json，并采用请求签名校验的交互方式，请求方式主要采用POST。

### 1.1 接口说明
- 所有的接口都遵循上面的交互格式，这样设计的目的主要是为了接口安全，后台可以快速定位到相关接口的问题并进行处理。
- 字段名采用驼峰命名规范。

## 接口明细
### 2.1 利率管理页面查询接口
- 请求地址：`/rate/search`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| searchkey     | String      |   否 |(模糊匹配)|

- 请求示意：

```json
{
	searchkey:"value"
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
| message | String | 是 | 错误信息（成功则为 null ）
| data     | Array      |   是 |相关数据集|

- 数据库表设计：

CREATE TABLE `bd_rate` (
  `id` varchar(36) NOT NULL COMMENT '主键',
  `code` varchar(40) DEFAULT NULL COMMENT '编码',
  `name` varchar(300) DEFAULT NULL COMMENT '名称',
  `tenantid` varchar(36) DEFAULT NULL COMMENT '租户（云数据中心）主键',
  `sysid` varchar(50) DEFAULT NULL COMMENT '应用编码，在用友云企业应用中心注册的编码',
  `creator` varchar(36) DEFAULT NULL COMMENT '创建人',
  `creationtime` datetime DEFAULT NULL COMMENT '创建时间',
  `modifier` varchar(36) DEFAULT NULL COMMENT '修改人',
  `modifiedtime` datetime DEFAULT NULL COMMENT '修改时间',
  `ratedays` int(3) DEFAULT NULL COMMENT '利率天数',
  `ratetype` int(2) DEFAULT NULL COMMENT '利率类型 0=Libor利率、1=贷款利率、2=活期利率、3=定期利率',
  `ratestartdate` datetime DEFAULT NULL COMMENT '利率起效日期',
  `rate` decimal(10,8) DEFAULT NULL COMMENT '利率',
  `precision` int(1) DEFAULT '2' COMMENT '利率精度(0-8)',
  `overdue` decimal(10,0) DEFAULT NULL COMMENT '逾期利率',
  `advance` decimal(10,0) DEFAULT NULL COMMENT '提前利率',
  `currtypeid` varchar(36) DEFAULT NULL COMMENT '币种id',
  `ratechangedate` datetime DEFAULT NULL COMMENT '利率变更日期',
  `enable` tinyint(4) DEFAULT NULL COMMENT '启用状态',
  `version` int(3) DEFAULT '1' COMMENT '版本',
  `revisedate` datetime DEFAULT NULL COMMENT '变更日期',
  `reviser` varchar(36) DEFAULT NULL COMMENT '变更人',
  `newest` int(1) DEFAULT '1' COMMENT '是否最新版本',
  `originalid` varchar(36) DEFAULT NULL COMMENT '原始主键（多版本）',
  `ts` datetime NOT NULL,
  `dr` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='利率管理'

- data示意：

|字段          |类型         |是否必须 |     说明	 |	备注
|--------------|-------------|---------|------------|------------|
| rateid      | String       | 是 | 利率ID | 新增后端生成 |
| code | String | 是 | 利率编码 | |
| ratename | String      |   是 | 利率名称 ||
| dayofyear     | Integer      |   是 | 利率天数 | 枚举(360/365) |
| creator     | String      |   是 | 创建人 | 后端新增时赋值 |
| creationtime     | String      |   是 | 创建时间 | 新增保存时赋值 |
| ratetype     | String      |   是 | 利率类型 | 枚举("2"活期利率、"3"定期利率、"0"Libor利率、"1"贷款利率) |
| revisedate     | String      |   是 | 利率起效日期 ||
| pk_currtype     | String      |   是 | 币种 | 币种id |
| rate     | float      |   是 | 利率 | 利率数值 |
| versiondate     | String      |   是 | 利率变更日期 | 变更保存时后台赋值 |
| versionno     | Integer      |   是 | 版本号 | 变更保存时后台赋值，从1开始，每次变更加1 |

- 响应示意：

```json
{
	"data": {
		"pageInfo": null,
		"rows": [
			{
				"rowId": "0",
				"values": {
					"rateid": {
						"display": "10000z600548401",
						"scale": -1,
						"value": "10000z600548401"
					},
					"ratetype": {
						"display": "活期利率",
						"scale": -1,
						"value": "CRATE"
					},
					"revisedate": {
						"display": "2017-10-20 00:00:00",
						"scale": -1,
						"value": "2017-10-20 00:00:00"
                    }
                    ...
				}
			},
			{
				"rowId": "1",
				"values": {
					"rateid": {
						"display": "10000z6005484MJ",
						"scale": -1,
						"value": "10000z600548MJ"
					},
					"code": {
						"display": "1002",
						"scale": -1,
						"value": "1002"
                    }
                    ...
				}
            }
            ...
		]
	},
	"message": null,
	"success": true
}
```

### 2.2 利率管理页面新增保存接口
- 请求地址：`/rate/save`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| data  |  JSON   |  是  |  保存的数据对象  |

- 请求示意：

```json
{
	"rateid": null
	"ratetype": "CRATE"
	"revisedate": "2017-10-20 00:00:00"
    ...
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|message|Obj|是|对象结构,后台具体描述
| data     | String      |   是 |添加成功提示|


- 响应示意：

```json
{
  "data" : "添加成功！",
  "message":null,
  "success": true
}
```

### 2.3 利率管理页面修改保存接口
- 请求地址：`/rate/save`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| data  |  JSON   |  是  |  保存的数据对象  |

- 请求示意：

```json
{
	"rateid": "10000z600548401",
	"ratetype": "CRATE",
	"revisedate": "2017-10-20 00:00:00",
	...
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|message|Obj|是|对象结构,后台具体描述
| data     | String      |   是 |添加成功提示|


- 响应示意：

```json
{
  "data" : "添加成功！",
  "message":null,
  "success": true
}
```

### 2.4 利率管理页面变更保存接口
- 请求地址：`/rate/revise`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| data  |  JSON   |  是  |  保存的数据对象(新增版本记录)  |

- 请求示意：

```json
{

	"rateid": "10000z600548401",
    "versionno": "2",
	"ratetype": "CRATE",
	"revisedate": "2017-10-20 00:00:00",
    ...
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|message|Obj|是|对象结构,后台具体描述
| data     | String      |   是 |添加成功提示|


- 响应示意：

```json
{
  "data" : "添加成功！",
  "message":null,
  "success": true
}
```

### 2.5 利率管理页面变更记录查询接口
- 请求地址：`/rate/reviseDetail`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| rateid     | String      |   是 |选中利率管理记录ID|


- 请求示意：

```json
{
    "rateid" : "value"
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|message|Obj|是|对象结构,后台具体描述
| data     | String      |   是 |返回查询的结果集(保存的变更记录都返回，按照变更日期排序)

- data示意：

|字段          |类型         |是否必须 |     说明		|	备注
|--------------|-------------|---------|--------------|------------|
| rateid      | String       | 是 | 利率ID | 新增后端生成 |
| revisedate     | String      |   是 | 利率起效日期 |变更时可更改|
| rate     | float      |   是 | 利率 | 利率数值 |
| versiondate     | String      |   是 | 利率变更日期 | 变更保存时后台赋值 |
| versionno     | Integer      |   是 | 版本号 | 变更保存时后台赋值，从1开始，每次变更加1 |

- 响应示意：

```json
{
	"data": {
		"pageInfo": null,
		"rows": [
			{
				"rowId": "0",
				"values": {
					"rateid": {
						"display": "10000z600548401",
						"scale": -1,
						"value": "10000z600548401"
					},
					"ratetype": {
						"display": "活期利率",
						"scale": -1,
						"value": "CRATE"
                    },
          			"rate": {
						"display": "10.00",
						"scale": 2,
						"value": "10.00"
          			},
					"revisedate": {
						"display": "2017-10-20 00:00:00",
						"scale": -1,
						"value": "2017-10-20 00:00:00"
          			}
          			...
				}
			},
			{
				"rowId": "1",
				"values": {
					"rateid": {
						"display": "10000z600548401",
						"scale": -1,
						"value": "10000z600548401"
					},
					"rate": {
						"display": "15.36",
						"scale": 2,
						"value": "15.36"
                    }
                    ...
				}
            }
            ...
		]
	},
	"message": null,
	"success": true
}
```

### 2.6 利率管理页面删除接口
- 请求地址：`/rate/delete`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| rateid     | String      |   是 |删除选中的利率管理记录|


- 请求示意：

```json
{
    "rateid" : "value"
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|message|Obj|是|对象结构,后台具体描述
| data     | String      |   是 |添加成功提示|


- 响应示意：

```json
{
  "data" : "删除成功！",
  "message":null,
  "success": true
}
```
