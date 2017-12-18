- 结算明细Modal  SettlementDetail

- API

|字段                    |说明                          |类型              |默认值     
|---------------------- |------------------------------|------------------|--------------
| title                 | 标题                         |string            |确确定要删除这条信息吗?
| type                  | 结算方式                      |number           |无返回参数
| process               | 结算进程                      |number           |无返回参数
| confirmText           | 确认按钮文字                  |string            |'不了'
| cancelText            | 取消按钮文字                   |string           |'删除'
| placement             | 弹出位置                      |string            |top,其他取值参照Popconfirm的placement