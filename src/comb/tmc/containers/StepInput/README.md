- 输入类似银行卡号时用到的input，分组输入

- API

|字段          |说明         |类型 |默认值     
|--------------|-------------|---------|--------------|
| step      | 每个input的字符数       |number |4|
| amount     | input的个数      |   number |4|
| value     | StepInput的值（所有input的值连在一起）      |   string |''|
| onChange     | onChange事件（同input）      |   function(value) ||