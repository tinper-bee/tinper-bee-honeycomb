# 银行贷款合同接口文档

## 主表信息请求接口

- 请求场景

1. 页面初加载
2. 点击页码切换
3. 切换分页大小
4. 输入页码跳转指定页面

- 请求方式: `post`

- 请求地址:

```
/tmc-bd-web/bd/bankaccbas/list
```
- 请求参数：

|字段         |类型          |是否必须    |     说明                    | 
|:------------|:------------|:-----------|:---------------------------|
|pageIndex    |Number       |否          |每页显示多少条数据(默认10)    |
|pageSize     |Number       |否          |当前显示的是第几页(默认1)     |

- 请求示例

```json
{
    "pageIndex": 2,
	"pageSize": 10 
}
```

## 子表信息请求接口

- 请求场景 

1. 点击主表某一行展开对应的子表

- 请求方式: `post`

- 请求地址: 

```
/tmc-bd-web/bd/bankaccbas/subquery
```

- 请求参数：

|字段         |类型          |是否必须    |     说明                    | 
|:------------|:------------|:----------|:----------------------------|
|id           |String       |是          |主表某条记录的唯一标识        |

- 请求示例

```json
{
    "id": "66e66ac1-6232-4d3c-b81a-df9333a22440"
}
```

## 删除主表中的某项

- 请求方式: `post`

- 请求地址: 

```
/tmc-bd-web/bd/bankaccbas/del
```

- 请求参数：

|字段         |类型          |是否必须    |说明                         | 
|:------------|:------------|:-----------|:---------------------------|
|无           |Array        |是          |由要删除的主表主键id组成的数组，批量删除   |

- 请求示例

```json 
[
    "66e66ac1-6232-4d3c-b81a-df9333a22440", "66e66ac1-6232-4d3c-b81a-df9333a22441"
]
```
## 新增页面请求数据接口

- 请求场景：

1. 在主表点击编辑跳转到该页面

- 请求方式: `post`

- 请求地址: 

```
/tmc-bd-web/bd/bankaccbas/form
```
- 请求参数：

|字段         |类型          |是否必须    |说明                         | 
|:------------|:------------|:-----------|:---------------------------|
|id           |String       |是          |传给后台的主表id，表示点击的主表的哪条信息进入的该页面 |

- 请求示例

```json 
{
    "id": "66e66ac1-6232-4d3c-b81a-df9333a22440"
}
```

## 新增页面保存数据接口

1. 在该页面，修改主表的信息，不修改子表的信息
2. 在该页面，不修改主表的信息，只修改子表的信息，包括新增子表记录，修改已有子表记录
3. 在该页面，修改主表的信息，同时修改子表的信息，包括新增子表记录，修改已有子表记录

- 请求方式: `post`

- 请求地址: 

```
/tmc-bd-web/bd/bankaccbas/save
```

- 请求参数：

|字段         |类型          |是否必须    |说明                         | 
|:------------|:------------|:-----------|:---------------------------|
|data         |Object       |是          |传给后台的数据对象            |
|head         |Object       |是          |head中存放主表的数据，包含pageinfo和rows两个字段|
|pageinfo     |Object       |否          |存放分页信息数据              |
|rows         |Object       |否          |存放每一条记录的具体信息，每一条记录包含rowId，status，values三个字段       |
|rowId        |Number/String|是          |rowId唯一标识主表的一条记录    |
|status       |Number       |是          |表示这次操作的类型，(0 不变,1 修改,2 新增,3 删除)|
|values       |Object       |否          |values是一条记录的具体信息，主表的values包含 账号、开户行、户名、开户公司、开户时间、境内外、备注 7个字段，子表的values包含 子户编码、子户名称、币种、账户类型、开户时间、状态、销户说明 7个字段。字段名称根据后台的字段名称确定。|

- 请求示例

主表修改，子表增删改示例：
```json
{
	"data": {
		"head": {
			"pageinfo": null,
			"rows": [
				{
                    "rowId": null,
                    "status": 1,
					"values": {
						"code": { "value": "e" },
						"memo": {"value": "e" },
						"banktype": { "value": "e" },
						"opentime": { "value": "2017-11-01" },
						"orgid": { "value": "e" },
						"bankid": { "value": "e" },
						"net_province": { "value": "e" },
						"net_enablestatus": { "value": 0 },
						"name": { "value": "e" },
						"net_name": { "value": "e" },
						"id": { "value": "3e55d00d-ee80-4c7e-b13d-f5c5f01ff819" },
						"net_code": { "value": "e" },
						"net_area": { "value": "e" },
						"ts": { "value": "2017-11-07 10:32:36" },
						"net_city": { "value": "e" }
					}					
				}
			]
		},
		"body": {
			"pageinfo": null,
			"rows": [
				{
                    "rowId": null,
                    "status": 1,
					"values": {
						"code": { "value": "8765-4921-9896-3333" },
						"balance": { "value": "673" },
						"name": { "value": "用友集团" },
						"accounttype": { "value": 0 },
						"id": { "value": "db29408e-d904-4829-a3eb-301c628a154c" },
						"parentid": { "value": "3e55d00d-ee80-4c7e-b13d-f5c5f01ff819" },
						"currtypeid": { "value": "美元" },
						"ts": { "value": "2017-11-07 10:32:36" }
					}
                },
                {
                    "rowId": null,
                    "status": 2,
					"values": {
						"code": { "value": "8765-4921-9896-3333" },
						"balance": { "value": "673" },
						"name": {  "value": "用友集团" },
						"accounttype": { "value": 0 },
						"currtypeid": { "value": "美元" },
					}
                },
                {
                    "rowId": null,
                    "status": 3,
					"values": {
						"id": { "value": "db29408e-d904-4829-a3eb-301c628a154c" },
						"parentid": { "value": "3e55d00d-ee80-4c7e-b13d-f5c5f01ff819" },
						"ts": { "value": "2017-11-07 10:32:36" }
					}
				}
			]
		}
	}
}
```