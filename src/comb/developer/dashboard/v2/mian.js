import { PureComponent } from 'react';
import MainLayout from '../layout/main-layout';
import UpperLayout from '../layout/upper-layout';
import MidLayout from '../layout/mid-layout';
import BotLayout from '../layout/bot-layout';
import ResInfo from '../component/resInfo';
import Link from '../component/link';
import QuickIn from '../container/quick-in';
import Faq from '../container/faq';
import Problem from '../container/problems';
import Alert from '../container/alert';
import NameCard from '../component/name-card';
import Detail from '../container/detail';
import Graph from '../container/graph';
import Pie from '../container/pie';


import {
  getResStatus,
  getNewAppInfo,
  getAletInfo,
} from '../api';

import './main.less';

export default class Main extends PureComponent {
  state = {
    resInfo: {
      app: 0,
      appHealthy: 0,
      appUnhealthy: 0,
    },
    alertInfo: [],
    accountInfo: [],
    appInfo: [],
    graphInfo: [],
  }
  componentDidMount() {
    getResStatus().then(data => {
      this.setState({
        resInfo: data
      })
    });
    getNewAppInfo().then(({ appInfo, graphInfo, accountInfo }) => {

      this.setState({
        graphInfo,
        appInfo,
        accountInfo
      })
    });
    getAletInfo().then(data => {
      this.setState({
        alertInfo: data,
      })
    })
  }

  getAvatar = (data) => {
    return {
      // 需要到时候修改，联系阿宝
      name: data,
    }
  }

  getDetail = (data = []) => {

    let conf = {
      pv: {
        iconCls: 'cl-touch',
        name: '页面访问量(PV)',
        value: 0,
        unit: '',
      },
      uv: {
        iconCls: 'cl-people',
        name: '用户访问量(UV)',
        value: 0,
        unit: '',
      },
      sent: {
        iconCls: 'cl-clock',
        name: '平均响应时间(RT)',
        value: 0,
        unit: 'ms',
      }
    }

    return data.map(item => {
      conf[item.type].value = item.value;
      return conf[item.type];
    })
  }

  render() {
    let { resInfo } = this.state;
    return (
      <MainLayout>
        <UpperLayout>
          <div className="break-point">
            <ResInfo
              iconCls="cl-cpu"
              data={[
                { name: 'CPU剩余', value: toFixed(resInfo.cpuLeft) },
                { name: 'CPU总数', value: toFixed(resInfo.cpu) },
              ]}
            />
            <ResInfo
              iconCls="cl-piechart"
              data={[
                { name: '内存剩余', value: toFixed(resInfo.memLeft, 1024), unit: 'GB' },
                { name: '内存总数', value: toFixed(resInfo.mem, 1024), unit: 'GB' },
              ]}
            />
            <ResInfo
              iconCls="cl-disk"
              data={[
                { name: '磁盘剩余空间', value: toFixed(resInfo.diskLeft, 1024), unit: 'GB' },
                { name: '磁盘总量', value: toFixed(resInfo.disk, 1024), unit: 'GB' },
              ]} />
          </div>
          <div className="break-point">
            <ResInfo
              iconCls="cl-box"
              data={[
                { name: '异常实例', value: resInfo.task - resInfo.taskHealthy },
                { name: '总实例', value: resInfo.task },
              ]}
            />
            <ResInfo
              iconCls="cl-box"
              data={[
                { name: '异常应用', value: resInfo.appUnhealthy },
                { name: '所有应用', value: resInfo.app },
              ]} />
            <Link
              href="/fe/continuous/index.html#/createApp"
            />
          </div>
        </UpperLayout>
        <MidLayout>
          <MidLayout.Box>
            <Pie
              value={[
                resInfo.appHealthy,
                resInfo.appUnhealthy,
                resInfo.app - resInfo.appHealthy - resInfo.appUnhealthy
              ]}
            />
          </MidLayout.Box>
          <MidLayout.Box
            className="mid-box-layout__secondary"
          >
            <QuickIn />
          </MidLayout.Box>
          <MidLayout.Box
            className="mid-box-layout__third"
          >
            <Faq
              name="常见问题"
              target="_blank"
              more="https://iuap.yonyoucloud.com/doc/cloud_developer_center.html#/md-build/cloud_developer_center/articles/cloud/4-/question.md"
            >
              <Problem />
            </Faq>
            <Faq
              name="资源报警"
              target="_self"
              more="/fe/alarm-center/index.html"
              style={{ margin: 0 }}
            >
              <Alert data={this.state.alertInfo} />
            </Faq>
          </MidLayout.Box>
        </MidLayout>
        {
          this.state.appInfo.map((info, index) => {
            let { appInfo, graphInfo, accountInfo } = this.state;
            return (
              <BotLayout>
                <NameCard
                  logoIndex={index + 1}
                  {...this.getAvatar(accountInfo[index]) }
                />
                <Detail
                  data={this.getDetail(appInfo[index])}
                />
                <Graph
                  data={graphInfo[index]}
                />
              </BotLayout>
            )
          })
        }
      </MainLayout>
    )
  }
}

function toFixed(value, scale = 1, len = 2) {
  let num = Number(value);
  if (num !== num) {
    num = 0;
  }
  let result = num / scale;

  return result.toFixed(2);
}
