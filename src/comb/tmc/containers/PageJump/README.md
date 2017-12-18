- 分页组件  PageJump

- API

|字段                    |说明                          |类型              |默认值     
|---------------------- |------------------------------|------------------|--------------
| pageSize              | 每页显示多少条记录             |number            |10, 还可以是20, 50, 100
| activePage            | 当前页码                      |number            |1，取值范围是1~maxPage
| maxPage               | 最大页码                      |number            |1
| totalSize             | 多少条记录                    |number            |1，pageSizeShow为true时显示
| onChangePageSize      | 改变页面显示多少条记录         |function(value)   |
| onChangePageIndex     | 页面跳转or切换页面             |function(value)   |
| pageSizeShow          | 是否显示:切换页面条数、多少条记录|bool              |true
| pageJumpShow          | 是否显示:页面跳转input         |bool              |true
| maxButtons            | 显示最多页数按钮               |number            |5
备注：数据量大于十条才显示分页