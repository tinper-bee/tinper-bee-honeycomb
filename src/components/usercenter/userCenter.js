import React, { Component } from 'react';
import mirror, {actions, connect,NavLink} from 'mirrorx'
const classNames = require('classnames');
import './index.css'

mirror.model({
  name: 'userCenter',
  initialState: {
    expanded:false,
    openKeys:[],
    menus:[],
  },
  reducers: {
    setExpanded(state,expanded) {
      const expand = expanded?false:!state.expanded;
      return {
        ...state,
        expanded:expand
      }
    }
  }
})


class UserCenter extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

   render() {

     const {expanded} = this.props;

     return (
       <div id="modalId"  className={classNames({ 'src-workbench-pc-containers-userCenter-style__wrap--3k3pB src-workbench-pc-containers-userCenter-style__clearfix--ObEoC animated':true,'slideInLeft': expanded,'slideOutLeft':!expanded})} >
         <div>
           <div className="src-workbench-pc-containers-userCenter-style__imgUser--1QqAs">
             <div className="src-workbench-pc-containers-userCenter-style__imgOuter--39fJx">
               <div className="src-workbench-pc-containers-userCenter-style__defaultPic--2VuNM"><i
                 className="uf uf-tinperzc-col"></i></div>
             </div>
             <div className="src-workbench-pc-containers-userCenter-style__editPortrait--NhuIV"><i
               className="iconfont icon-copyreader um-icon-md " title="修改头像"></i></div>
             <div className="src-workbench-pc-containers-userCenter-style__userName--1TM0Y" title="zhaoyuu">zhaoyuu...</div>
           </div>
           <div className="src-workbench-pc-containers-userCenter-style__logOut--2E57I"><i
             className="iconfont icon-exit um-icon-md "></i><span>注销</span></div>
           <ul
             className="src-workbench-pc-containers-userCenter-style__gloryIcon--oACmY src-workbench-pc-containers-userCenter-style__clearfix--ObEoC">
             <li>
               <div className="src-workbench-pc-containers-userCenter-style__iconContainer--1JqNx undefined"><i
                 className="uf uf-cloud-o-down " title="荣耀"></i></div>
             </li>
             <li>
               <div
                 className="src-workbench-pc-containers-userCenter-style__iconContainer--1JqNx src-workbench-pc-containers-userCenter-style__icon3--2R-un">
                 <i className="uf uf-notification" title="动态"></i></div>
             </li>
           </ul>
         </div>
         <div>
           <ul
             className="src-workbench-pc-containers-userCenter-style__userBtnList--2CIJF src-workbench-pc-containers-userCenter-style__clearfix--ObEoC">
             <li>
               <button type="button" className="u-button u-button-sm u-button-border">首页编辑</button>
             </li>
             <li>
               <div className="src-workbench-pc-components-dropdown-style__dropdown_button_cont--2ykM-">
                 <div className="src-workbench-pc-components-dropdown-style__label_cont--3AZGU"><label>帐号设置</label></div>
                 <div className="src-workbench-pc-components-dropdown-style__btn_pull_down--2U3tA"><i
                   className="iconfont icon-pull-down um-icon-md src-workbench-pc-components-dropdown-style__icon_style--BaGr6"></i>
                 </div>
               </div>
             </li>
             <li>
               <div className="src-workbench-pc-components-dropdown-style__dropdown_button_cont--2ykM-">
                 <div className="src-workbench-pc-components-dropdown-style__label_cont--3AZGU"><label>系统设置</label></div>
                 <div className="src-workbench-pc-components-dropdown-style__btn_pull_down--2U3tA"><i
                   className="iconfont icon-pull-down um-icon-md src-workbench-pc-components-dropdown-style__icon_style--BaGr6"></i>
                 </div>
               </div>
             </li>
           </ul>
         </div>
         <div className="um-content src-workbench-pc-containers-userCenter-style__tabContent--3l3XI">
           <div className="u-tabs u-tabs-top demo-tabs u-tabs-simple">
             <div role="tablist" className="u-tabs-bar" tabindex="0">
               <div className="u-tabs-nav-container">
                 <div className="u-tabs-nav-wrap">
                   <div className="u-tabs-nav-scroll">
                     <div className="u-tabs-nav u-tabs-nav-animated">
                       <div className="u-tabs-ink-bar u-tabs-ink-bar-animated"
                            style={{'display': 'block','transform': 'translate3d(0px, 0px, 0px)','width': '96px'}}></div>
                       <div role="tab" aria-disabled="false" aria-selected="true"
                            className="u-tabs-tab-active u-tabs-tab">最近使用
                       </div>
                       <div role="tab" aria-disabled="false" aria-selected="false" className=" u-tabs-tab">推广服务</div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             <div className="u-tabs-content u-tabs-content-animated" style={{'height': '100%','transform': 'translateX(0%) translateZ(0px)'}}>
               <div role="tabpanel" aria-hidden="false"
                    className="u-tabs-tabpane u-tabs-tabpane-active src-workbench-pc-containers-userCenter-style__tabPane1--1pqT7">
                 <ul className="src-workbench-pc-containers-userCenter-style__recently--3se9f">
                   <li>
                     <div className="src-workbench-pc-containers-userCenter-style__usedIcon--AZzC8">
                       <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4Qzk2QjQ2RkQ5OTkxMUU3OTJDNEI4MkQ4MUI2ODg5MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4Qzk2QjQ3MEQ5OTkxMUU3OTJDNEI4MkQ4MUI2ODg5MyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhDOTZCNDZERDk5OTExRTc5MkM0QjgyRDgxQjY4ODkzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhDOTZCNDZFRDk5OTExRTc5MkM0QjgyRDgxQjY4ODkzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+E1pvaAAACsJJREFUeNrUWWuQ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"/>
                     </div>
                     <div
                       className="src-workbench-pc-containers-userCenter-style__used--1zyvH src-workbench-pc-containers-userCenter-style__clearfix--ObEoC">
                       <div
                         className="src-workbench-pc-containers-userCenter-style__usedModule--2fERj src-workbench-pc-containers-userCenter-style__clearfix--ObEoC">
                         <div
                           className="src-workbench-pc-containers-userCenter-style__module--3ZnnR src-workbench-pc-containers-userCenter-style__clearfix--ObEoC">
                           <div className="src-workbench-pc-containers-userCenter-style__usedTit--1zI7U">结算中心</div>
                           <div className="src-workbench-pc-containers-userCenter-style__lastTime--2fa80">一天前</div>
                         </div>
                         <div className="src-workbench-pc-containers-userCenter-style__usedService--2ejoH">核算服务</div>
                       </div>
                     </div>
                   </li>
                 </ul>
                 <button type="button" className="u-button">清空列表</button>
               </div>
               <div role="tabpanel" aria-hidden="true"
                    className="u-tabs-tabpane u-tabs-tabpane-inactive src-workbench-pc-containers-userCenter-style__tabPane2--3Zlw_"></div>
             </div>
           </div>
         </div>
       </div>
     )
   }

}

export default connect(state => {
  return state.userCenter
})(UserCenter)