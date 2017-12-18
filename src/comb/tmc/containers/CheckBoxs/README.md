- 复选框CheckBox---一个  CheckBox

- API

|字段                    |说明                          |类型              |默认值     
|---------------------- |------------------------------|------------------|--------------
| checkBoxClass         | 父层class                    |string            |''
| disabled              | input的disabled              |bool              |false
| checked               | input的checked               |bool              |false
| children              | label内容                    |string/node       |''
| onSelect              | 勾选复选框回调                |function(bool)    |返回true or false
| others                | input的其他属性和自定义属性    |array             |自己定义去, type属性写死为checkbox
| indeterminate         | 在CheckTable中使用            |bool              |

demo：

import {CheckBox} from '------/containers/CheckBoxs';

<CheckBox 
    children={444}
    onSelect={(val)=> {console.log(val);}}
/>
或者
<CheckBox 
    onSelect={(val)=> {console.log(val);}}
>444</CheckBox>

------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------

- 复选框CheckBoxs---一个或多个  CheckBoxs
- API


- CheckBoxs

|字段                    |说明                          |类型                |默认值     
|---------------------- |------------------------------|--------------------|--------------
| checkBoxClass         | 父层class                    |string              |''
| disabled              | input的disabled              |bool                |false
| children              | label内容                    |string/number/node  |''
| others                | input的其他属性和自定义属性    |array               |自己定义去, type属性写死为checkbox

- CheckBoxsGroup

|字段                    |说明                          |类型              |默认值     
|---------------------- |------------------------------|------------------|--------------
| boxsGroupClass        | 父层class                    |string            |''
| selectedArray         | 哪一个CheckBox已勾选          |array             |[]
| onSelect              | 勾选复选框回调                |function(array)   |返回参数为array
| param                 | 返回值的类型                  |string            |'value',可选 'bool' or  'children', 见demo描述
| others                | 其他自定义属性                |array             |自己定义去

demo：

import {CheckBoxs} from '------/containers/CheckBoxs';
const CheckBoxsGroup= CheckBoxs.CheckBoxsGroup;

<CheckBoxsGroup
    onSelect={arr=> {this.setState({selectedArray: arr});}}
    selectedArray= {this.state.selectedArray}
>
    <CheckBoxs disabled>555</CheckBoxs>
    <CheckBoxs children={666}/>
    <CheckBoxs>777</CheckBoxs>
</CheckBoxsGroup>
或者
<CheckBoxs.CheckBoxsGroup
    ......
>
    ......
</CheckBoxs.CheckBoxsGroup>

描述： 提供一个参数param，可以根据自己需要返回的数据类型来自定义, 如下
1. param='value', 每个CheckBoxs都必须有value值，然后selectedArray为对应的值或其他值，对应的值则默认是选中状态, 比如
<CheckBoxsGroup selectedArray= {[-1, -1, 2]}>
    <CheckBoxs value={0}>555</CheckBoxs>
    <CheckBoxs value={1}>666</CheckBoxs>
    <CheckBoxs value={2}>777</CheckBoxs>
</CheckBoxsGroup>
此时页面刚加载进来默认已勾选选第三个CheckBoxs，假如最终勾选了第一第二个CheckBoxs，则onSelect返回[0, 1, null]

2. param='bool', 此时value非必填，然后selectedArray每一项为true或者false，为true则默认是选中状态, 比如
<CheckBoxsGroup selectedArray= {[false, false, true]}>
    <CheckBoxs value={0}>555</CheckBoxs>
    <CheckBoxs value={1}>666</CheckBoxs>
    <CheckBoxs value={2}>777</CheckBoxs>
</CheckBoxsGroup>
此时页面刚加载进来默认已勾选选第三个CheckBoxs，假如最终勾选了第一第二个CheckBoxs，则onSelect返回[true, true, null/false]

3. param='children', 此时value非必填，children(CheckBoxs里的555/666/777)必须是number或者string，然后selectedArray每一项为对应的children或其他值，为对应的children则默认是选中状态, 比如
<CheckBoxsGroup selectedArray= {[null, null, 777]}>
    <CheckBoxs value={0}>555</CheckBoxs>
    <CheckBoxs value={1}>666</CheckBoxs>
    <CheckBoxs value={2}>777</CheckBoxs>
</CheckBoxsGroup>
此时页面刚加载进来默认已勾选选第三个CheckBoxs，假如最终勾选了第一第二个CheckBoxs，则onSelect返回[null, mull, '777']

param !== 'bool'时， 这里selectedArray的每一项值除了null可以是其他任意值，只要不和对应的value，children冲突即可