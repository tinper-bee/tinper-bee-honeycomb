# 付息接口文档

## 接口规范
请求和返回的数据格式都是json，并采用请求签名校验的交互方式，请求方式主要采用POST。

### 1.1 接口说明
- 所有的接口都遵循上面的交互格式，这样设计的目的主要是为了接口安全，后台可以快速定位到相关借口的问题并进行处理。
- 字段名采用驼峰命名规范。

## 接口明细
### 2.1 放款编号查询接口
- 请求地址：`/fm/repayinterest/queryfinancepaybyloancode`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| search     | String      | 是      |模糊搜索字符串|

- 请求示意：

```json
{
    "loancode":"0123"
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|msg|String|是|错误信息（成功则为 null ）
| data     | obj      |   是 |响应数据|

- data字段详情：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| dataList      | array       | 是 |数据列表|


- 响应示意：

```json
 {
  "data": {
    "head": {
      "pageinfo": null,
      "rows": [
        {
          "rowId": null,
          "values": {
            "financepayid": {
              "display": "331212",
              "scale": -1,
              "value": "331212"
            },
            "loancode": {
              "display": "4444",
              "scale": -1,
              "value": "4444"
            }
          },
          "status": 0
        },
        {
          "rowId": null,
          "values": {
            "financepayid": {
              "display": "5555",
              "scale": -1,
              "value": "5555"
            },
            "loancode": {
              "display": "444",
              "scale": -1,
              "value": "444"
            }
          },
          "status": 0
        }
      ]
    }
  },
  "message": null,
  "success": true
}
```

 
```

### 2.2 根据放款编号查询表头信息
- 请求地址：`/fm/repayinterest/queryfinancepaybyid`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| financepayid      | String      | 是      |放款编号|

- 请求示意：

```json
{
    "financepayid":"fixedDeposit"
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|msg|String|是|错误信息（成功则为 null ）
| data     | obj      |   是 |响应数据|

- data字段详情：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
|repaydate |string|是|还款日期|
|currtypeid|obj|是|币种|
|rate|string|是|本币汇率|
|payment|string|是|付息金额|
|vbillstatus|string|是|审核状态|
|repaymny|string|是|付息汇总金额|
|unrepaymny|string|是|未付利息金额|
|memo|string|是|备注|
|guarantee|string|是|担保方式|
|loanbankid|obj|是|借款单位账户|

- 响应示意：

```json
{
    "data" : {
        "head":{
            "repaydate":"2017-11-11",
            "currtypeid":{
                "display":"",
                "value":"",
            },
            "rate":"1:1",
            "payment":"1000",
            "vbillstatus":"0",
            "repaymny":"2222",
            "unrepaymny":"100",
            "memo":"无",
            "guarantee":"0",
            "loanbankid":{
                "display":"",
                "value":"",
            }
        },
    },
    "msg":null,
    "success": true
    }

修改后：
{
  "data": {
    "head": {
      "pageinfo": null,
      "rows": [
        {
          "rowId": null,
          "values": {
            "approver": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "creator": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "paytotalintstmny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "financepayid": {
              "display": "331212",
              "scale": -1,
              "value": "331212"
            },
            "billstatus": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "modifier": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "loancode": {
              "display": "4444",
              "scale": -1,
              "value": "4444"
            },
            "memo": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "vbillstatus": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "vbillno": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "repaymny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "repaydate": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "loanbankid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "orgid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "currtypeid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "dr": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "modifiedtime": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "rate": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "approvedate": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "contractid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "id": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "creationtime": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "unrepaymny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "ts": {
              "display": "null",
              "scale": -1,
              "value": null
            }
          },
          "status": 0
        },
        {
          "rowId": null,
          "values": {
            "approver": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "creator": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "paytotalintstmny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "financepayid": {
              "display": "5555",
              "scale": -1,
              "value": "5555"
            },
            "billstatus": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "modifier": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "loancode": {
              "display": "444",
              "scale": -1,
              "value": "444"
            },
            "memo": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "vbillstatus": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "vbillno": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "repaymny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "repaydate": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "loanbankid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "orgid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "currtypeid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "dr": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "modifiedtime": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "rate": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "approvedate": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "contractid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "id": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "creationtime": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "unrepaymny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "ts": {
              "display": "null",
              "scale": -1,
              "value": null
            }
          },
          "status": 0
        }
      ]
    }
  },
  "message": null,
  "success": true
}
```

### 2.3 搜索还款计划编号
- 请求地址：`/fm/repayinterest/queryplanbyfinancepayid`
- 请求方式：`POST`
- 请求参数：loanid

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| loancode      | String      | 是      |放款编号|
| content      | String      | 是      |模糊搜索字符串|

- 请求示意：

```json
{
    "financepayid":"fixedDeposit",
   // "content":"0123"
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|msg|String|是|错误信息（成功则为 null ）
| data     | obj      |   是 |响应数据|

- data字段详情：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| dataList      | array       | 是 |数据列表|


- 响应示意：

```json
{
    "data" : {
     "dataList":  [
        {
            "还款计划编号":"",
            "付息日期":"",
            "应还利息":"",
            "实付利息":"",
        },{
            "还款计划编号":"",
            "付息日期":"",
            "应还利息":"",
            "实付利息":"",
        }
     ]
  },
  "msg":null,
  "success": true
}

修改后
{
  "data": {
    "plan": {
      "pageinfo": null,
      "rows": [
        {
          "rowId": null,
          "values": {
            "shdrepaymny": {
              "display": "-69.90000000",
              "scale": -1,
              "value": "-69.90000000"
            },
            "repayinterestid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "repayplancode": {
              "display": "5",
              "scale": -1,
              "value": "5"
            },
            "id": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "repaydate": {
              "display": "2017-11-14",
              "scale": -1,
              "value": "2017-11-14"
            },
            "dr": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "actrepaymny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "ts": {
              "display": "null",
              "scale": -1,
              "value": null
            }
          },
          "status": 0
        },
        {
          "rowId": null,
          "values": {
            "shdrepaymny": {
              "display": "20.00000000",
              "scale": -1,
              "value": "20.00000000"
            },
            "repayinterestid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "repayplancode": {
              "display": "3",
              "scale": -1,
              "value": "3"
            },
            "id": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "repaydate": {
              "display": "2017-11-14",
              "scale": -1,
              "value": "2017-11-14"
            },
            "dr": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "actrepaymny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "ts": {
              "display": "null",
              "scale": -1,
              "value": null
            }
          },
          "status": 0
        }
      ]
    }
  },
  "message": null,
  "success": true
}
```
### 2.4 查询银团贷款数据
- 请求地址：`/fm/repayinterest/querybankbyCntid`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| contractid      | String      | 是      |放款编号|

- 请求示意：

```json
{
    "contractid":"fixedDeposit",
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|msg|String|是|错误信息（成功则为 null ）
| data     | obj      |   是 |响应数据|

- data字段详情：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| dataList      | array       | 是 |数据列表|


- 响应示意：

```json
{
    "data" : {
     "body":{
        "0":[{
            "参与行":"",
            "实际比例":"",
            "还本金":""
        },{
            "参与行":"",
            "实际比例":"",
            "还本金":""
        }]
    }
  },
  "msg":null,
  "success": true
}

修改后
{
  "data": {
    "bank": {
      "pageinfo": null,
      "rows": [
        {
          "rowId": null,
          "values": {
            "bankid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "actratio": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "id": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "dr": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "actrepaymny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "ts": {
              "display": "null",
              "scale": -1,
              "value": null
            }
          },
          "status": 0
        } ,
        {
          "rowId": null,
          "values": {
            "bankid": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "actratio": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "id": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "dr": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "actrepaymny": {
              "display": "null",
              "scale": -1,
              "value": null
            },
            "ts": {
              "display": "null",
              "scale": -1,
              "value": null
            }
          },
          "status": 0
        }
      ]
    }
  },
  "message": null,
  "success": true
}
```

### 2.5 保存并付息
- 请求地址：`/fm/repayinterest/save`
- 请求方式：`POST`
- 请求参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| 无      |       |       ||

- 请求示意：

```json
{
    "head":{
        "repaydate":"2017-11-11",
        "currtypeid":{
            "display":"",
            "value":"",
        },
        "rate":"1:1",
        "payment":"1000",
        "vbillstatus":"0",
        "repaymny":"2222",
        "unrepaymny":"100",
        "memo":"无",
        "guarantee":"0",
        "loanbankid":{
            "display":"",
            "value":"",
        }
    },
    "body":{
        "还款计划":[{
            "还款计划编号":"",
            "付息日期":"",
            "应还利息":"",
            "实付利息":"",
        },{
            "还款计划编号":"",
            "付息日期":"",
            "应还利息":"",
            "实付利息":"",
        }],
        "银团贷款":[{
            "参与行":"",
            "实际比例":"",
            "还本金":""
        },{
            "参与行":"",
            "实际比例":"",
            "还本金":""
        }]
    }
}
```

- 响应参数：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| success      | Boolean       | 是 |相关查询状态 true (成功) / false (失败)|
|msg|String|是|错误信息（成功则为 null ）
| data     | obj      |   是 |响应数据|

- data字段详情：

|字段          |类型         |是否必须 |     说明
|--------------|-------------|---------|--------------|
| dataList      | array       | 是 |数据列表|


- 响应示意：

```json
{
    "data" :"保存成功",
    "msg":null,
    "success": true
}
```