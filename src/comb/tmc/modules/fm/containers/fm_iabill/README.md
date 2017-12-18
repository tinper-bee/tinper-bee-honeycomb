# 利息清单详情组件
### 引入：import InterestListModal from '路径';
### 需要传入的props：
- 计息引入：主表为多条数据， table显示／ 计息调整引入： 主表一条数据，row显示
* showModal 值：true/false   用来控制Modal的显示隐藏
* overdue 值：true/false 数据是否逾期（暂定）
* upClick 值：func 用于设置showModal的值
* parenttype 值：financepay （放款界面引入）/intadjustbill（计息调整页面引入）（必须）
* needmainTable 值：true/false （必须） true为计息页面引入/false为计息调整引入 
* iabillKey 值：props传入（必须）查取主表和子表的id


* 	**获取主表接口：url + fm/interests/searchLXQD**
*  参数`{
            "page":'',
            "size":'',
            "searchParams":{
             "searchMap":{
                  "contcode":''
              }
            }  
        }`
    1. *page:获取第几页数据，
    2. *size：获取一页数据的数量，
    3. *contcode：外部组件传入的key（id）
* 	**获取子表接口：url + fm/interests/searchQD**
*  参数`{
            "page":'',
            "size":'',
            "searchParams":{
             "searchMap":{
                  "contcode":''
              }
            }  
        }`
    1. *page:获取第几页数据，
    2. *size：获取一页数据的数量，
    3. *contcode：主表的key（id））