## 审批工作台-审批详情适配
1. 配置路由
```javascript
<Route path="(approve/)financepay/:id" component={ Financepay }/>   
```
2. 引入组件

```javascript
import ApproveDetail from 'containers/ApproveDetail'
```

3. 使用组件

审批流程的id会从url的query部分传入
```javascript
<ApproveDetail processInstanceId={this.props.location.query.processInstanceId} />
```

4. 在发现路由里有'approve/'时，显示ApproveDetail组件，页面变为浏览态，隐藏所有按钮

## 单据页-审批按钮适配
1. 引入审批流程按钮组件

```javascript
import ApproveDetailButton from 'containers/ApproveDetailButton'
```

2. 使用组件

```javascript
<ApproveDetailButton processInstanceId={id} />
```


