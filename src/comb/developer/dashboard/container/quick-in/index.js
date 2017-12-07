import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Title from '../../component/title';
import Entry from '../../component/entry-block';
import './index.less';

var Height = 400; //


const CONF = [{
  href: "https://iuap.yonyoucloud.com/",
  imgsrc: require('../../img/cloud.png'),
  name: '用友云平台',
  width: '70%',
}, {
  href: "https://market.yonyoucloud.com/",
  imgsrc: require('../../img/market.png'),
  name: '用友云市场',
  width: '50%',
}, {
  href: "https://emm.yonyoucloud.com",
  imgsrc: require('../../img/uap-mobile@2x.png'),
  name: '移动平台EMM',
  width: '27%',
}, {
  href: "https://iuap.yonyoucloud.com/doc/cloud_developer_center.html#/md-build/cloud_developer_center/articles/cloud/1-/architecture.md",
  imgsrc: require('../../img/documentation@2x.png'),
  name: '帮助中心',
  width: '24%',
}, {
  href: "https://kb.yonyoucloud.com",
  imgsrc: require('../../img/libary@2x.png'),
  name: '知识库',
  width: '33%',
}, {
  href: "https://api.yonyoucloud.com",
  imgsrc: require('../../img/logo-APIlink.png'),
  name: 'APILink',
  width: '65%',
}]


// 特殊处理
let CAPTION_STYLE = {
  2: { top: '-5px' },
  5: { top: '9px' },
}


export default class QuickIn extends PureComponent {

  setMarginTop = () => {
    let parent = this.refs.entry.offsetParent;
    let height = parent.clientHeight;
    let heightEntries = this.refs.entry.clientHeight;
    let margin = (height - heightEntries - 50) / 2;
    this.refs.entry.style.marginTop = margin + 'px';
  }

  componentDidMount() {
    this.setMarginTop();
    window.addEventListener('resize', this.setMarginTop);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setMarginTop)
  }

  render() {
    return (
      <div className="quick-in">
        <Title name="快捷入口" />
        <div
          ref="entry"
          className="quick-in--entry"
        >
          {
            CONF.map((item, index) => {
              return (
                <Entry
                  {...item}
                  captionStyle={CAPTION_STYLE[index]}
                />
              )
            })
          }
          {/* <Entry />
          <Entry />
          <Entry />
          <Entry />
          <Entry />
          <Entry /> */}
        </div>
      </div>
    )
  }
}