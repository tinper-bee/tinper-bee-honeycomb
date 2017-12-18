## 上传附件组件说明

> 上传附件组件适用于单据的浏览及修改状态。
>
> 单据新增状态不应该调用上传附件组件。

### API 


参数 | 是否必须 |说明 | 类型 | 默认值
---- | ---- | ---- | ---- | ---
billID | 是 |单据id | string | 无

### 如何使用？
> 引用示例见`demo.js`

1. 引入组件

```javascript 
import TmcUploader from 'containers/TmcUploader';
```

2. 使用组件

```javascript
<TmcUplaoder billID = 'code'/> // 当前单据id
```