import React, {Component, PropTypes} from 'react';
import {Row, ProgressBar, Col, Icon, Button, Message, Badge} from 'tinper-bee';

import {ImageIcon} from 'components/ImageIcon';
import Title from 'components/Title';

import {
  formateDate,
  getCookie
} from 'components/util';

import './index.less';


class MiroAppInfo extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  /**
   * 权限管理
   */
  goToAuth = () => {
    let {data} = this.props;

    this.context.router.push(`/auth/${data.appName}?id=${data.appUploadId}&providerId=${getCookie('u_providerid')}&busiCode=app_upload&userId=${data.userId}`);
  }



  render() {
    let {
      data,
      publishInfo
    } = this.props;

    return (
        <Row>
          <Title name={data.appName}/>
          <div className="detail-bg">
            <div className="tile-cricle">
              <div className="tile-img">
                {
                  ImageIcon(data.iconPath, 'head-img')
                }
              </div>
            </div>
            <span className="title">
        {data.appName}
              <span className="state">
        {!data.publishTime && <Badge colors="warning">待部署</Badge>}
        </span>
        </span>
            <span className="health">
        </span>
            <span className="time">
                <Icon type="uf-time-c-o"/>
                {formateDate(data.createTime)}
            </span>
            <div className="btn-group">
              {
                data.adminAuth === 'true' ? (
                  <span
                    className="btn"
                    onClick={this.goToAuth}>
                     <i className="cl cl-permission"/>
                      权限管理
                  </span>
                ) : null
              }
            </div>
          </div>
          <div>
            <h3>
              我是微服务。
            </h3>
          </div>
        </Row>

    )
  }
}


export default MiroAppInfo;
