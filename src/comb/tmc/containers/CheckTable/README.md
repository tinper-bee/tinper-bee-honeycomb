- 复选Table CheckTable    CheckTable

- API

|字段                    |说明                          |类型                     |默认值     
|---------------------- |------------------------------|-------------------------|--------------
| className             |className                     |string                   |''
| columns               | table的columns               |array                    |[], 除了复选框这一列以外的所有列信息
| data                  | table的data                  |array                    |[]
| isClearChecked        | data变化时是否清空已选项       |bool                     |true
| param                 | 返回勾选项的属性              |string                    |''(返回整个record), param='id', 则只返回record里的id, 见备注1
| selectedList          | 已选择项的回调函数             |function(arr1, arr2)     |返回已选择项数据和选项状态, 见备注2
| selectedBool          | 决定table里的默认选择项        |array                    |返回已选择项数据和选项状态, 见备注2
| others                | bee-table的其他属性           |array                    |自己定义去


备注：
1. param决定了selectedList里的arr1的返回数据
2. arr1为data的每项数据, arr2为每项的选中状态 => true/false, 本人在结算平台中要做俩个table的数据映射，需要使用到此数据, 故特意返回, 大家应该用不上, 只取第一个参数arr1即可

demo：

import CheckTable from '------/containers/CheckTable';

<CheckTable
    bordered  
    className="bd-table"
    columns={[......]} 
    data={[......]} 
    selectedList= {arr => {console.log(arr, '哈哈哈');}}
    emptyText= {() => <span>暂无数据</span>}
    rowKey= {record => record.id.value}
/>

