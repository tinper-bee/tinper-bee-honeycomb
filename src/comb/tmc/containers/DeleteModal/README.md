- 删除Modal  DeleteModal

- API

|字段                    |说明                          |类型              |默认值     
|---------------------- |------------------------------|------------------|--------------
| title                 | 标题                         |string            |确确定要删除这条信息吗?
| onConfirm             | 确定按钮                      |function          |无返回参数
| onCancel              | 取消按钮                      |function          |无返回参数
| confirmText           | 确认按钮文字                  |string            |'删除'
| cancelText            | 取消按钮文字                   |string           |'取消'
| placement             | 弹出位置                      |string            |top,其他取值参照Popconfirm的placement