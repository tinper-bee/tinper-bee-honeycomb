import {Component, PropTypes} from 'react';
import {Button, Table, Col, Icon, Popconfirm} from 'tinper-bee';
import {Link} from 'react-router';

import LoadingTable from '../../../components/loading-table';

import {formateDate} from '../../../components/util';

import AlarmDetail from '../alarm-details';

import verifyAuth from '../../../components/authPage/check';

import './index.less';


class AlarmManager extends Component {
  static propTypes = {
    data: PropTypes.array,
    activeMenu: PropTypes.string
  }
  static defaultProps = {
    data: [],
    activeMenu: 'res',
  }
  static contextTypes = {
    router: PropTypes.object
  }
  state = {
    showDetailModal: false,
    selectedId: ''
  }
  columns1 = [{
    title: '资源池名称',
    dataIndex: 'ResourcePoolName',
    key: 'ResourcePoolName',
  }, {
    title: '通知类型',
    dataIndex: 'Type',
    key: 'Type',
    render: (text, record) => {
      return `${record.Phone ? "短信通知" : ""} ${record.Email ? "邮件通知" : ""}`
    }
  }, {
    title: '创建时间',
    dataIndex: 'CreateTime',
    key: 'CreateTime',
    render: (text) => {
      return formateDate(text);
    }
  },{
    title: '操作',
    dataIndex: 'name',
    key: 'name',
    render: (text, rec) => {
      return (
        <div className="control-icon">
          <i className="cl cl-permission" title="权限管理"
             onClick={this.managerAuthRes(rec)}/>
          <i className="cl cl-eye" title="查看详情" onClick={ this.handleControl(true, rec.ResourcePoolId) }/>
          <Popconfirm placement="bottom" onClose={ this.props.onDelete(rec) } content="确认要删除吗？">
            <i  title="删除" className="cl cl-delete"/>
          </Popconfirm>

        </div>
      )

    }
  }];

  columns2 = [{
    title: '应用名称',
    dataIndex: 'AppName',
    key: 'AppName',
  }, {
    title: '通知类型',
    dataIndex: 'Type',
    key: 'Type',
    render: (text, record) => {
      return `${record.Phone ? "短信通知" : ""} ${record.Email ? "邮件通知" : ""}`
    }
  }, {
    title: '创建时间',
    dataIndex: 'CreateTime',
    key: 'CreateTime',
    render: (text) => {
      return formateDate(text);
    }
  }, {
    title: '操作',
    dataIndex: 'name',
    key: 'name',
    render: (text, rec) => {
      return (
        <div className="control-icon">
          <i className="cl cl-permission" title="权限管理"
             onClick={this.managerAuthApp(rec)}/>
          <i className="cl cl-eye" title="查看详情" onClick={ this.handleControl(true, rec.AppId) }/>
          <Popconfirm placement="bottom" onClose={ this.props.onDelete(rec) } content="确认要删除吗？">
            <i title="删除" className="cl cl-delete"/>
          </Popconfirm>

        </div>
      )

    }
  }];

  columns3 = [{
    title: '服务名称',
    dataIndex: 'ServiceName',
    key: 'ServiceName',
  }, {
    title: '通知类型',
    dataIndex: 'Type',
    key: 'Type',
    render: (text, record) => {
      return `${record.Phone ? "短信通知" : ""} ${record.Email ? "邮件通知" : ""}`
    }
  }, {
    title: '创建时间',
    dataIndex: 'CreateTime',
    key: 'CreateTime',
    render: (text) => {
      return formateDate(text);
    }
  }, {
    title: '操作',
    dataIndex: 'name',
    key: 'name',
    render: (text, rec) => {
      return (
        <div className="control-icon">
          <i className="cl cl-permission" title="权限管理"
             onClick={this.managerAuthSev(rec)}/>
          <i className="cl cl-eye" title="查看详情" onClick={ this.handleControl(true, rec.Id) }/>
          <Popconfirm placement="bottom" onClose={ this.props.onDelete(rec) } content="确认要删除吗？">
            <i  title="删除" className="cl cl-delete"/>
          </Popconfirm>

        </div>
      )

    }
  }];

  /**
   * 管理权限APP
   * @param rec
   */
  managerAuthApp = (rec) => {
    return (e) => {

      e.stopPropagation();
      verifyAuth('alarm_app', rec, () => {
        this.context.router.push(`/auth/${rec.AppName}?id=${rec.AppId}&userId=${rec.UserId}&providerId=${rec.ProviderId}&backUrl=md-service&busiCode=alarm_app`);
      })

    }
  }

  /**
   * 管理权限资源池
   * @param rec
   */
  managerAuthRes = (rec) => {
    return (e) => {
      e.stopPropagation();
      verifyAuth('alarm_pool', rec, () => {
        this.context.router.push(`/auth/${rec.ResourcePoolName}?id=${rec.ResourcePoolId}&userId=${rec.UserId}&providerId=${rec.ProviderId}&backUrl=md-service&busiCode=alarm_pool`);
      })
    }
  }

  /**
   * 管理权限服务
   * @param rec
   */
  managerAuthSev = (rec) => {
    return (e) => {
      e.stopPropagation();
      verifyAuth('alarm_service', rec, () => {
        this.context.router.push(`/auth/${rec.ServiceName}?id=${rec.Id}&userId=${rec.UserId}&providerId=${rec.ProviderId}&backUrl=md-service&busiCode=alarm_service`);
      })
    }
  }

  handleControl = (value, id) => () => {
    this.setState({
      showDetailModal: value,
      selectedId: id
    })
  }

  render() {
    let {activeMenu, data, showModal, showLoading} = this.props;
    let columns;
    if(activeMenu === 'res'){
      columns = this.columns1
    }else if(activeMenu === 'app'){
      columns = this.columns2
    }else{
      columns = this.columns3
    }
    return (
      <div className="alarm-manager">
        <Col md={12} sm={12}>
          <Button shape="squared" colors="primary" className="add-btn" onClick={ showModal }>添加监控对象</Button>

        </Col>
        <Col md={12} sm={12} className="client-container">
          <div className="client">
            <LoadingTable className="alarm-table" showLoading={ showLoading } data={ data }
                          columns={ columns }/>
          </div>
        </Col>
        <AlarmDetail
          type={activeMenu}
          show={ this.state.showDetailModal }
          onClose={ this.handleControl(false) }
          dataId={ this.state.selectedId }
        />
      </div>
    )
  }
}

export default AlarmManager;
