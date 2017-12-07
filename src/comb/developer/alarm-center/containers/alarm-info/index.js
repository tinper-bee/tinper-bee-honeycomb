import { Component } from 'react';
import { Tabs, TabPanel, Table, Message, Pagination } from 'tinper-bee';
import ScrollableInkTabBar from 'bee-tabs/build/ScrollableInkTabBar';
import TabContent from 'bee-tabs/build/TabContent';

import Title from '../../../components/Title';
import { Inform } from '../../components';
import ManagerBlank from '../manager-blank';
import LoadingTable from '../../../components/loading-table';
import { formateDate } from '../../../components/util';
import { getAlarmList } from '../../../serves/alarm-center';

import './index.less';

class AlarmInfo extends Component{
  static propTypes = {}
  static defaultProps = {}
  state = {
    alarmInfo: [],
    showLoading: true,
    activePage: 1,
    totalPage: 0
  }
  columns = [{
    title: '报警时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text) => {
      return formateDate(text);
    }
  },{
    title: '报警类型',
    dataIndex: 'alarm_type',
    key: 'alarm_type',
  },  {
    title: '报警名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '报警详情',
    dataIndex: 'detail',
    key: 'detail',
    width: '50%'
  }, {
    title: '接收人',
    dataIndex: 'contacts',
    key: 'contacts'
  }];
  componentDidMount(){
   this.getAlarm(`?limit=10&offset=0`)
  }

  /**
   * 获取报警列表
   * @param param
   */
  getAlarm = (param = '') => {
    getAlarmList(param).then((res) => {
      let data = res.data;
      if(data.error_code){
        this.setState({
          showLoading: false
        })
        return Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        })
      }

      if(data.data instanceof Array){
        data.data.forEach((item, index) => {
          item.key = index
        })
        this.setState({
          alarmInfo: data.data,
          totalPage: Math.ceil(data.size/10)
        })
      }
      this.setState({
        showLoading: false
      })
    }).catch(() => {
      this.setState({
        showLoading: false
      })
    })
  }

  /**
   * 分页点选
   * @param eventKey
   */
  handleSelect = (eventKey) => {
    this.setState({
      activePage: eventKey
    });
    this.getAlarm(`?limit=10&offset=${eventKey}`)
  }

  render(){
    return (
      <div>
        <Title name="报警中心" showBack={false} />
        <div className="container">
          <div className="blank">
            <Tabs
              defaultActiveKey="1"
              onChange={() => {}}
              destroyInactiveTabPane
              renderTabBar={()=><ScrollableInkTabBar />}
              renderTabContent={()=><TabContent />}
            >
              <TabPanel tab='报警信息' key="1">
                <LoadingTable
                  className="alarm-info-table"
                  data={ this.state.alarmInfo }
                  columns={ this.columns }
                  showLoading={ this.state.showLoading } />

                  {
                    this.state.totalPage > 1 ? (
                      <Pagination
                        className="info-pagination"
                        first
                        last
                        prev
                        next
                        items={this.state.totalPage}
                        maxButtons={5}
                        activePage={this.state.activePage}
                        onSelect={this.handleSelect}/>
                    ) : ''
                  }



              </TabPanel>
              <TabPanel tab='报警管理' key="2">
                <ManagerBlank />
              </TabPanel>
              <TabPanel tab='通知维护' key="3">
                <Inform
                 username="波波"
                 email="ww.bobo.com"
                 phone="12312312312"
                />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

export default AlarmInfo;
