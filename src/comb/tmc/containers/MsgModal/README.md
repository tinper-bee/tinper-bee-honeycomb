- 提示Modal  MsgModal

- API

|字段                    |说明                          |类型              |默认值     
|---------------------- |------------------------------|------------------|--------------
| show                  | 是否显示                     |bool               |false
| title                 | 标题                         |string            |''
| content               | 内容                         |string            |''
| onConfirm             | 点击确定按钮                 |function           |无返回参数
| onCancel              | 点击取消(关闭)按钮            |function          |一个参数, 见备注1
| confirmText           | 取消按钮文字                  |string            |'确定'
| cancelText            | 页面跳转or切换页面             |string           |'取消'
| closeButton           | 右上角是否显示关闭按钮         |bool              |false, 见备注2
| icon                  | icon的class                  |string            |false
| isButtonWhite         | 确定button的背景色是否为#00b39e  |bool            |true, 是

备注:
1. 特殊情况点击取消按钮和右上角'X'关闭Modal时执行的效果不一样，故特此返回一个参数做标记, true代表点击'X', false代表点击取消按钮
2. 这个把bee-modal的'X'给隐藏了, 换成我们自己需要使用的icon了, 所以这个参数大家不用管

请求示例：
<MsgModal 
    show={true}
    title='fasfdsa'
    content={`sdfsdf<span style="color: red">fsadjfdskj</span>sdgffd`}
    onCancel={() => {console.log(12)}}
    onConfirm={() => {console.log(34)}}
/>
备注：content可能有特殊样式，如上那样，把样式写进去				