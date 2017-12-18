## 授信协议调整
## 授信协议调整
### 表结构  fm_creditadjust

字段编码  |  字段名称  |  字段类型  |  是否可空  |  备注
---|---|---|---|---|
id  |  主键  |  char(36)  |  否  |  表主键
vbillno  |  单据编号  |  varchar(36)  |  否  |  
orgid  |  组织ID  |  varchar(36)  |  否  |  
creditid  |  授信协议ID  |  varchar(36)  |  否  |  
creditcurrency  |  授信币种  |  varchar(36)  |  否  |  
credittype  |  授信协议类型  |  varchar(36)  |  否  |  
bankcretypeid  |  银行授信协议类别  |  varchar(36)  |  否  |  
writebackdir  |  回写方向  |  int  |  否  |  1-释放 2-占用
ccamount  |  占用授信金额  |  decimal(28,8)  |  否  |  
vbillstatus  |  审批状态  |  int  |  否  |  " 0-待提交 3-待审批 
2-审批中 1-审批通过"
remarks  |  备注  |  varchar(1024)  |  是  |  
sysid  |  应用编码  |  varchar(50)  |  是  |  应用编码，在用友云企业应用中心注册的编码
parentid  |  上级主键  |  char(36)  |  是  |  可选
innercode  |  内部码  |  varchar(1024)  |  是  |  可选
tenantid  |  租户（云数据中心）主键  |  varchar(36)  |  否  |  目前是大部分为8位，部分老租户和合并过来的租户为36位
creator  |  创建人  |  varchar(36)  |  否  |  友户通用户id，不保证为36位，因此使用varchar
creationtime  |  创建时间  |  datetime  |  否  |  
approver  |  审批人  |  varchar(36)  |  是  |  友户通用户id，不保证为36位，因此使用varchar
approvedate  |  审批时间  |  datetime  |  是  |  
ts  |  时间戳  |  datetime  |  否  |  
dr  |  删除标记  |  int  |  否  |  0-正常 1-删除
modifier  |  修改人  |  varchar(36)  |  是  |  友户通用户id，不保证为36位，因此使用varchar
modifiedtime  |  修改时间  |  datetime  |  是  |  


### 接口
### 授信调整新增保存、修改保存：
- URL：/fm/creditAdjust/save
status字段说明：
2-新增 1-修改 3-删除 0-未更改

### 授信调整 分页模糊查询：
- URL：/fm/creditAdjust/pageQuery

### 授信调整查询明细：
- URL：/fm/creditAdjust/queryById
接收json：
{"id":"1345464121654"}

### 授信调整 根据单据编号查询明细：
- URL：/fm/creditAdjust/queryByVllNo
接收json：
{"villno":"1345464121654"}


