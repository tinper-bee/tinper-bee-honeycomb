- 单选框Radios   Radios
- API


- Radios

|字段                    |说明                          |类型                 |默认值     
|---------------------- |------------------------------|--------------------|--------------
| radioClass            | 父层class                    |string               |''
| value                 | input的value                 |string/number        |''
| disabled              | input的disabled              |bool                 |false
| children              | label内容                    |string/number/node   |''
| others                | input的其他属性和自定义属性    |array                |自己定义去, type属性写死为radio, name属性这里不用加，加了也没用

- RadiosGroup

|字段                    |说明                          |类型              |默认值     
|---------------------- |------------------------------|------------------|--------------
| radioGroupClass       | 父层class                    |string            |''
| selectedVal           | 选择的radio的value            |string/number    |''
| name                  | radio必须有相同的name         |string            |'hahaha'
| onSelect              | 勾选单选 回调                 |function(val)    |返回参数为选择的radio的value 
| others                | 其他自定义属性                |array             |自己定义去

demo: 
import Radios from '../../../containers/Radios';
const RadiosGroup= Radios.RadiosGroup;

<Radios.RadiosGroup
    onSelect={(val)=> {this.setState({val});}}
    selectedVal={this.state.val}
    name='aa'
>
    <Radios value={1} disabled children={111}/>
    <Radios value={2}>222</Radios>
    <Radios value={3} children={333}/>
</Radios.RadiosGroup>
或者
<RadiosGroup
    .......
>
    .......
</RadiosGroup>


备注： 用的时候Radios外必须要包一层RadiosGroup，哈哈，水平有限，打脸了