## pass（支付结算平台）模块

### 包括containers、pages基本文件夹，以及router（业务模块内部路由表）

1. containers 文件内目录结构

```base
|——/containers        ----容器组件(模块内部公共容器组件)
  |——/container1      ----业务容器1
    |——index.js
    |——index.less
  |——/container2      ----业务容器2
    |——index.js
    |——index.less
  |—— ...
```

2. pages 文件内目录结构

```base
|——/pages         ----节点页面(各个节点的基本页面)
  |——/page1       ----页面1
    |——index.js
    |——index.less
    |——/docs      ----页面接口文档
      |——api1.md   	
      |—— ...
  |——/page2       ----页面2
    |——index.js
    |——index.less
    |——/docs      ----页面接口文档
      |——api1.md   	
      |—— ...	
  |—— ...
```