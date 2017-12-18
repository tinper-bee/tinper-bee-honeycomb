#  协议状态 agreestatus
NOCOMMIT("待提交", 0),
NOAUDIT("待审批", 3),
NOEXECUTE("未执行", 1),
EXECUTING("在执行", 5),
FINISHED("已结束", 6);

# 审批状态 vbillstatus
FREE(0, "待提交"), 
COMMIT(3, "待审批"), 
APPROVING(2, "审批中"), 
APPROVED(1, "审批通过");

# 列表页面按钮显示  

#详情页顶部按钮显示控制
根据协议状态 agreestatus
待提交 0 提交 修改 删除
待审批 3 收回
未执行 1 
在执行 5 变更 变更记录 结束
已结束 6 取消结束

取消提交==>待提交
取消结束==>在执行 
变更==>待提交

删除协议: 版本号=1,协议状态待提交  可以删除协议
删除版本: 版本号>2,协议状态待提交  可以删除版本

# 变更记录操作按钮显示
根据审批状态
待提交 0 提交 删除
待审批 3 取消提交
审批中 2 无
已审批 1 无

# 列表页跳转详情页

默认新增
读取`this.props.location.query.type`来识别是那种操作;

this.props.location.state
1. 新增
<Link to={{ pathname: '/fm/creditdetail', query: { type: 'add' }, state: { id: record.id.value } }}>
2. 修改
<Link to={{ pathname: '/fm/creditdetail', query: { type: 'edit' }, state: { id: record.id.value } }}/>
3. 变更
<Link to={{ pathname: '/fm/creditdetail', query: { type: 'modify' }, state: { id: record.id.value } }}>
4. 查看
<Link to={{ pathname: '/fm/creditdetail', query: { type: 'view' }, state: { id: record.id.value } }}>

## 变更
1. 允许变更的字段
控制方式  原币额度 担保方式 备注 还有表格中的担保合同数据
2. 需要给后台传递的数据:
    协议部分:
    creditagree:
        creditagreeid:
        controltype:
        money:
        guaranteetype:
        memo:
    担保合同部分:
    creditguarantee:
        guarantee:
        currtypeid:
        occquota:

3. 变更记录
变更记录显示的字段
版本号  控制方式  原币额度 担保方式 审批状态 操作 


# 接口相关
fm/creditagree/list(列表查询)  ok
fm/creditagree/recordchange(变更记录)  ok
fm/creditagree/selectById(通过主键查询协议) ok

fm/creditagree/save(新增,修改) ok
fm/creditagree/change(变更) ok

fm/creditagree/del(删除)
fm/creditagree/commit(提交) 
fm/creditagree/uncommit(收回)
fm/creditagree/end(结束)
fm/creditagree/unend(取消结束)
fm/creditagree/delversion(删除版本)
传id和ts 




未执行  无
在执行  变更 变更记录 结束
已完成  取消结束


币种:
卡片  creditagree  currtypeid: { display: '', value: null }, // 币种 currenyid
种类列表1  guaranteeGroup[0]  currtypeid currenyid
明细列表2  guaranteeGroup[1]  currtypeid
合同列表3  guaranteeGroup[2]  currtypeid


currtypeidRef: {}, //币种参照
currtypeidRefTab0: [], //授信种类上的币种参照
currtypeidRefTab1: [], //授信明细上的币种参照
currtypeidRefTab2: [], //授信明细上的币种参照


# 页面参照
orgidRef: {}, //组织参照
agreebankidRef: {}, // 授信银行参照
currenyidRef: {}, //币种参照
inheritagreeRef: {}, // 继承授信协议参照

typeRef: [], // 授信种类下的类型参照
credituseunitRef: [], // 授信使用单位参照
credittypeRef: [], // 授信明细上的授信类别参照
loanbankidRef: [], //贷款银行参照
guaranteeRef: [], //担保合同参照
currtypeidRefTab0: [], //授信种类上的币种参照
currtypeidRefTab1: [], //授信明细上的币种参照
currtypeidRefTab2: [], //担保合同上的币种参照




# 报错

返回数据data null时报错 ok

修改  新增子表时  当前实体的租户和系统的租户不一致  

必输项  组织不能为空/n协议编号不能为空/n授信银行不能为空/n原币金额不能为空/n起始日期不能为空/n结束日期不能为空/n   ok

金额  输入 数字格式控制

参照和下拉列表显示问题  参照ok 下拉 未处理

变更记录上显示控制  已处理

金额 精度显示控制 编辑态带入的未处理


# 表格增删改
状态status(0 不变,1 修改,2 新增,3 删除)
删除行只要 ts和id


不变行  state中直接抽数据 status 0 
修改行  state中抽数据  status 1
新增行  state中push一行 status 2
删除行  在deletedRow push一项  status 3  state中删除这一行

新增时,要加一个临时的tempid,来唯一标识这一行

删除时要判断删除的是之前存在的还是新增后没保存的行,如果这一行数据中有tempid属性,说明是新增的,否则是之前的;或者id值为true,说明是存在的,否则为新增的
如果是新增的,直接在deleted数组中删除这一项 通过tempid来找到这叫记录然后删除
如果是之前存在的,在deletedRow数组中增加一项

修改时,要判断修改的是之前存在的还是新增后没保存的行
如果是新增的,直接把state中对应的值修改即可,
如果是存在的行,需要把myStatus变成2,然后把state中的值对应修改


保存时,根据
点保存按钮时,从状态中抽出要发送的值,在拼上删除的行

能不能在每次请求数据后给每一个行加一个myStatus属性,保存在state中
后面都读取myStatus的值作为status的值
不变行  state中直接抽数据 status 0 
修改行  state中抽数据  status 1



1. 协议类型 creditagree.agreetype

<Option value="group">集团授信</Option>
<Option value="org">企业授信</Option>

企业授信 授信使用单位 creditdetail.credituseunit 不可以编辑
集团授信 授信使用单位 creditdetail.credituseunit 可以编辑  参照财务组织

credituseunitRef: [], // 授信使用单位参照

显示ok  未测试
2. 担保方式   creditagree.guaranteetype
选择信用的时候  不显示担保表格
<Option value="1">信用</Option>
creditagree.guaranteetype===1 不显示担保表格
3. 分授信类别控制  
creditagree.credittypecontral===true  不显示credittype表格
不勾选的时候    不显示授信种类表格
勾选的时候     显示授信种类表格
4. 授信明细 
至少一行记录


表格
1. 授信种类   分授信类别控制 不勾选  不显示 变更时不可以编辑
2. 授信明细   变更时不可以编辑
3. 担保合同   担保方式为信用是不显示  变更时可以编辑

编辑态 editable  可以编辑
变更禁用  disabled  不可以编辑
分授信类别控制  creditagree.credittypecontral===true 不显示授信种类credittype表格
担保方式为信用  creditagree.guaranteetype===1 不显示担保合同creditguarantee表格

切换的时候需要将之前选过的清空