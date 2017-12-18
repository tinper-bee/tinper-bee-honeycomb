- 文字提醒组件 Tips

- API

|字段                    |说明                          |类型              |默认值     
|---------------------- |------------------------------|------------------|--------------
| class_name            | 特有className                |string            |''
| placement             | 显示位置                     |string             |top，可选left, right, bottom
| overlay               | 提示文字                     |string             |'', 必传
| inverse               | 提示文字背景是是否为白色       |bool              |true
| trigger               | 触发叠加层的事件              |string            |hover, 可选click, focus
| icon                  | icon的className              |string            |'', 比如编辑icon可传icon-bianji, 查看iconfont
| click                 | 点击事件                     |function          |