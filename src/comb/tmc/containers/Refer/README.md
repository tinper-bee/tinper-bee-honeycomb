## 参照
## 参照
### API

参数 | 说明|类型|默认值
---|---|---|---|
refCode|参照编码（必输）|string |'code'| 
refModelUrl|参照请求地址（必输）|string|''| 
refName|参照名称| string|'name'| 
ctx|请求上下文|string|'uitemplate_web'
value|参照的值（必输）| object|{}|
onChange|选中参照后的回调（必输）|function(value)|null
strField|配置显示的列|array| [{ name: '名称', code: 'refname' }]| 
isMultiSelectedEnabled|是否多选|boolean| false| 
pk_val|参照过滤pk|string| ''| 
condition| 模糊搜索{name:'111',code:'111'}|object|null| 
isReturnCode| 是否返回编码|boolean|false| 
multiLevelMenu| 配置多级菜单[{ name: '省', code: 'provence',width:150 }]|array|[]|
hotDataSize|历史记录条数|number|20|
showLabel|是否显示label|boolean|false|
pageSize|分页请求数据时每页条数|number|20|
disabled|是否禁用|boolean|false|
referClassName|参照最外层classname|string|''|
className|参照input的classname|string|''|
style|参照最外层样式|object|{}|
clientParam|自定义条件（某些参照会用到）|object|{}|
placeholder|placeholder|string|''|
isTreeCanSelect|多级菜单型参照，树分类是否可选|boolean|false|

v1.1新增
- 多级菜单可配置列的宽度，默认200，最小80
- 新增showLabel属性，默认false，不显示label

v1.2新增
- 分页条数可配置
- 新增disabled

v1.3新增
- 参照最外层classname
- 参照input的classname
- 参照最外层样式
- 自定义条件（某些参照会用到）

v1.4新增
- 参照支持多选
- 增加placeholder属性

示例：

```javascript
import React, { Component } from 'react';
import { Row, Col } from 'tinper-bee';
import Refer from '../../../../containers/Refer';
import './index.less';
export default class Bankaccbas extends Component {
	constructor() {
		super();
		this.state = {
			currency1: {},
			currency2: {},
			finbranchRef: {},
			transtypeRef: {}
		};
	}
	render() {
		let { finbranchRef, transtypeRef } = this.state;
		return (
			<Row style={{ margin: '0' }}>
				{/*普通参照*/}
				<Col xs={6}>
					<Refer
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/cctypeRef/'}
						refCode={'cctypeRef'}
						refName={'授信类别'}
						strField={[{ name: '名称', code: 'refname' }]}
						value={this.state.currency1}
						onChange={value => {
							console.log(value);
							this.setState({ 
								currency1: value 
							});
						}}
					/>
				</Col>
				{/*复杂参照*/}
				<Col xs={6}>
					<Refer
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/finbranchRef/'}
						refCode={'finbranchRef'}
						refName={'金融网点'}
						value={finbranchRef}
						onChange={value => {
							finbranchRef = value;
							this.setState({ finbranchRef });
						}}
						multiLevelMenu={[
							{
								name: '金融机构',
								code: 'refname'
							},
							{
								name: '金融网点',
								code: 'refname'
							}
						]}
					/>
				</Col>
				<Col xs={6}>
					<Refer
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/finbranchRef/'}
						refCode={'finbranchRef'}
						refName={'金融机构'}
						value={finbranchRef}
						onChange={value => {
							finbranchRef = value;
							this.setState({ finbranchRef });
						}}
					/>
				</Col>
				<Col xs={6}>
					<Refer
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/transtypeRef/'}
						refCode={'transtypeRef'}
						refName={'交易类型'}
						value={transtypeRef}
						onChange={value => {
							transtypeRef = value;
							this.setState({ transtypeRef });
						}}
						isTreeCanSelect={true}
						multiLevelMenu={[
							{
								name: '交易大类',
								code: 'refname'
							},
							{
								name: '交易类型',
								code: 'refname'
							},
							{
								name: '事件',
								code: 'refname'
							}
						]}
					/>
				</Col>
			</Row>
		);
	}
}

```
### 参照-refCode-refModelUrl对照表

参照名称（refName） | refCode|refModelUrl|clientParam|strField|测试环境上是否可用
---|---|---|---|---|---
 授信类别 | cctypeRef|/bd/cctypeRef/|||是
 财务组织| finorgRef|/bd/finorgRef/|||是
 币种| currencyRef|/bd/currencyRef/|||是
 结算方式| balatypeRef|/bd/balatypeRef/|||是
 金融机构| finbranchRef|/bd/finbranchRef/|||是
 金融网点| finbranchRef|/bd/finbranchRef/|||是
 合作伙伴| partnerRef|/bd/partnerRef/|||是
 银行账户| bankaccbasRef|/bd/bankaccbasRef/|||是
 项目| projectRef|/bd/projectRef/|||是
 项目类型|projectClassRef |/bd/projectClassRef/|||是
 交易类型| transtypeRef|/bd/transtypeRef/|||是
 利率管理| rateRef|/bd/rateRef/|||**是**
 还款方式| repaymentmethodRef|/bd/repaymentmethodRef/|||是
  结息日 | interestDayRef |/bd/interestDayRef/|||是
 放款计划| payplancode|/fm/payplanref/|||**否**
 合同 | contractcode|/fm/contractref/|||**否**
 授信协议| ccagreementRef|/bd/ccagreementRef/|||**否**
 银行类别|同金融机构|同金融机构|||是

