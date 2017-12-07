import { Component } from 'react';
import { Table, Message, Row, Modal } from 'tinper-bee';



import {addAppAlarm, addResAlarmGroup, getAppAlarmInfo, getResAlarmInfo,getServiceAlarmInfo,getResContacts } from '../../../serves/alarm-center';

import { formateDate } from '../../../components/util';

import './index.less';

let resColumns = [
  {
    title: '名称',
    dataIndex: 'ResourcePoolName',
    key: 'ResourcePoolName'
  },
  {
    title: '通知人',
    dataIndex: 'AlarmUser',
    key: 'AlarmUser',
    render:(text,rec) =>{
      return <div className="alarmUser"> {rec.AlarmUser} </div>
    }
  },
  {
    title: '监控参数',
    dataIndex: 'Policies',
    key: 'Policies',
    render:(text,rec) =>{
     // console.log(rec);

      return(
        rec.Policies.length === 0 ? ("该资源池没有添加主机性能监控"):
          (<span>{`cpu: ${(JSON.parse(rec.Policies).cpu*100).toFixed(0)}%/内存: ${(JSON.parse(rec.Policies).memory*100).toFixed(0)}%/磁盘: ${(JSON.parse(rec.Policies).storage*100).toFixed(0)}%`}</span>)
      )
    }

  },
  {
    title: '报警间隔（秒）',
    dataIndex: 'AlarmInterval',
    key: 'AlarmInterval'
  }, {
    title: '更新时间',
    dataIndex: 'UpdateTime',
    key: 'UpdateTime',
    render: (text) => formateDate(text)
  },
  {
    title: '创建时间',
    dataIndex: 'CreateTime',
    key: 'CreateTime',
    render: (text) => formateDate(text)
  },

];

let appColumns = [
  {
    title: '名称',
    dataIndex: 'AppName',
    key: 'AppName'
  },
  {
    title: '通知人',
    dataIndex: 'AlarmUser',
    key: 'AlarmUser',
    render:(text,record) =>{
   //   console.log(record);
      return <div className="alarmUser">{record.AlarmUser} </div>
    }
  },
  {
    title: '扫描间隔（秒）',
    dataIndex: 'Interval',
    key: 'Interval'
  },
  {
    title: '报警间隔（秒）',
    dataIndex: 'AlarmInterval',
    key: 'AlarmInterval'
  }, {
    title: '更新时间',
    dataIndex: 'UpdateTime',
    key: 'UpdateTime',
    render: (text) => formateDate(text)
  },
  {
    title: '创建时间',
    dataIndex: 'CreateTime',
    key: 'CreateTime',
    render: (text) => formateDate(text)
  },

];

let serviceColumns = [
  {
    title: '名称',
    dataIndex: 'ServiceName',
    key: 'ServiceName'
  },
  {
    title: '通知人',
    dataIndex: 'AlarmUser',
    key: 'AlarmUser',
    render:(text,rec) =>{
      return <div className="alarmUser"> {rec.AlarmUser} </div>
    }
  },
  {
    title: '监控URL',
    dataIndex: 'RequestUrl',
    key: 'RequestUrl'
  },
  {
    title: '报警间隔（秒）',
    dataIndex: 'AlarmInterval',
    key: 'AlarmInterval'
  }, {
    title: '更新时间',
    dataIndex: 'UpdateTime',
    key: 'UpdateTime',
    render: (text) => formateDate(text)
  },
  {
    title: '创建时间',
    dataIndex: 'CreateTime',
    key: 'CreateTime',
    render: (text) => formateDate(text)
  },

];

class AlarmDetail extends Component{
  state = {
    alarmList: []
  };

  componentWillReceiveProps(nextProp) {
    let { type, dataId, show } = nextProp;
    if(show) {
      if (type === 'res') {
        getResAlarmInfo(dataId)
          .then((res) => {
            let data = res.data;
            let contacts;
            if (data.error_code) {
              return Message.create({
                content: data.error_message,
                color: 'danger',
                duration: null
              })
            }
            if (data instanceof Array) {
              data.forEach((item) => {
                item.key = item.ResourcePoolId;
                contacts = item.Contacts;
              });

              getResContacts(contacts)
                .then((res) => {
                  let userData = res.data;
                  if (userData.error_code) {
                    return Message.create({
                      content: userData.error_message,
                      color: 'danger',
                      duration: null
                    })
                  }
                  data[0].AlarmUser = userData;
                  this.setState({
                    alarmList: data
                  })
                })

            }
          })
      } else if (type === 'app') {
        getAppAlarmInfo(dataId)
          .then((res) => {
            let data = res.data;
            let contacts;
            if (data.error_code) {
              return Message.create({
                content: data.error_message,
                color: 'danger',
                duration: null
              })
            }
            if (data instanceof Array) {
              data.forEach((item) => {
                item.key = item.AppId;
                contacts = item.Contacts;
              });

              getResContacts(contacts)
                .then((res) => {
                  let userData = res.data;
                  if (userData.error_code) {
                    return Message.create({
                      content: userData.error_message,
                      color: 'danger',
                      duration: null
                    })
                  }
                  data[0].AlarmUser = userData;
                  this.setState({
                    alarmList: data
                  })
                })

            }

          })
      } else {
        getServiceAlarmInfo(dataId)
          .then((res) => {

            let data = res.data;
            let contacts;
            if (data.error_code) {
              return Message.create({
                content: data.error_message,
                color: 'danger',
                duration: null
              })
            }
            if (data instanceof Array) {
              data.forEach((item) => {
                item.key = item.AppId;
                contacts = item.Contacts;
              });

              getResContacts(contacts)
                .then((res) => {
                  let userData = res.data;
                  if (userData.error_code) {
                    return Message.create({
                      content: userData.error_message,
                      color: 'danger',
                      duration: null
                    })
                  }
                  data[0].AlarmUser = userData;
                  this.setState({
                    alarmList: data
                  })
                })

            }

          })
      }
    }

  }

  render() {
    let { type, show, onClose } = this.props;
    let title, columns;
    if(type === 'res'){
      title = '资源池报警详情';
      columns = resColumns;
    }else if(type === 'app'){
      title = '应用报警详情';
      columns = appColumns;
    }else{
      title = '服务报警详情';
      columns = serviceColumns;
    }

    return (
    <Modal
      show = { show }
      onHide={ onClose }
      size="lg"
      >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table data={ this.state.alarmList } columns={ columns } />
      </Modal.Body>

      <Modal.Footer>

      </Modal.Footer>
    </Modal>

    )
  }
}

export default AlarmDetail;
