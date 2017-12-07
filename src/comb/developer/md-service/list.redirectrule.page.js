// publics
import {Component, PropTypes} from 'react'
import {Button, Table, Icon, Popconfirm, Message, Row} from 'tinper-bee'
import {withRouter} from 'react-router'

// self components
import withStyle from './component/withStyle.hoc'
import Header from './component/header.component'
import DashBoard from './component/board.component'
import PopupModal from './component/popupModal.component'

import RedirModal from './component/redirModal.component'

import {dateFormat} from './util'
import {splitParam} from '../components/util'
// api
import {operation, listQ, renew, checkstatus, deleteRedire} from '../serves/middleare'

import {GetPublishList} from '../serves/appTile'
// static
import './index.css'
import {logo, STATE, PROPS, OPT, OPT_EN, MILLISECS_IN_A_DAY, insStatusStyle} from './const'


const STORAGE_TYPE = 'redirectrule'
const WrappedHeader = withRouter(Header);

const typeAry = [
  "应用",
  "负载均衡",
  "IP"
]
const matchTypeAry = [
  "URL",
  "cookie",
  "IP"
]

class ListPage extends Component {
  static propTypes = {}
  static defaultProps = {}

  state = {
    clickIndex: null,
    dataSource: [],
    showModal: false,
    showRediret: false,
    selectedData: {},
    isAdd: true,
    appList: []
  }
  // none state data
  __modalPayLoad = []
  __opType = ''

  // lifeCyle hooks
  componentDidMount() {

    this.handleRefresh();
    this.getAppList();

  }

  // methods
  handleRefresh = () => {

    const serviceType = STORAGE_TYPE;
    listQ({size: 20, index: 0}, serviceType, `&search_nginxId=${this.props.params.id}`)
      .then((data) => {
        if (data.error_code) {
          Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          })
        } else {
          if (data.hasOwnProperty('content')) {
            this.setState({
              dataSource: data['content']
            });
          }
        }

      });

  }

  /* Modal handling methods */
  manageRowOperation = rec => evt => {
    /* use simple factory now.
     * if complicated,change to use factory method
     */
    const type = evt.target.dataset.label;
    this.__opType = type;
    this.setModalPayLoad([rec]);
    this.setState({
      showRediret: true,
      isAdd: false
    });
  }

  /**
   * 获取app列表
   */
  getAppList = () => {
    GetPublishList().then((res) => {
      let data = res.data;
      if (data.error_code) {
        Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        })
      } else {
        this.setState({
          appList: data
        })
      }
    })
  }

  showRedir = eve => {
    this.setState({
      showRediret: true,
      isAdd: true
    });
  }
  getModalPayLoad = () => {
    return this.__modalPayLoad || [];
  }
  setModalPayLoad = (payLoad) => {
    this.__modalPayLoad = payLoad;
  }
  hideModal = () => {
    this.setState({
      showModal: false,
      showRediret: false
    });
  }

  /* instance processing methods:
   * destroy renewal
   * start stop restart changepassword are about to be added
   */
  destroySelectedInstance = () => {
    operation(this.__modalPayLoad, STORAGE_TYPE, OPT.DESTROY)
      .then(() => {
        this.setState({showModal: false});
        this.handleRefresh();
      });
  }
  renewalSelectedInstance = () => {
    renew(this.__modalPayLoad, STORAGE_TYPE)
      .then(() => {
        this.setState({showModal: false});
        this.handleRefresh();
      })
  }
  editTable = () => {
    renew(this.__modalPayLoad, STORAGE_TYPE)
      .then(() => {
        this.setState({showModal: false});
        this.handleRefresh();
      })
  }

  /**
   * 删除
   **/
  handleDelete = (rec) => {
    return () => {
      deleteRedire(`?redirectruleid=${rec.id}`)
        .then((res) => {
          if (res.data.error_code) {
            Message.create({
              content: res.data.error_message,
              color: 'danger',
              duration: null
            })
          } else {
            Message.create({
              content: '删除成功',
              color: 'success',
              duration: 1.5
            })
            this.handleRefresh();
          }

        })
    }
  }


  // renders
  renderTableColumns = () => {
    let serviceType = STORAGE_TYPE;
    const {style} = this.props;
    const columns = [{
      title: '规则名称',
      dataIndex: PROPS[serviceType]['id'],
      key: 'name',
    }, {
      title: '转发类型',
      dataIndex: 'proxypassType',
      key: 'proxypassType',
      render: (text) => {
        return typeAry[text]
      }

    }, {
      title: '转发规则',
      dataIndex: 'matchType',
      key: 'matchType',
      render: (text) => {
        return matchTypeAry[text]
      }

    }, {
      title: '后端服务',
      dataIndex: 'proxypass',
      key: 'proxypass',
      render: (text, rec) => {
        let {dataSource, appList} = this.state;
        if (rec.proxypassType === 1) {
          let obj = dataSource.filter((item) => item.insId == text);
          return obj[0] && obj[0].ruleName
        } else if (rec.proxypassType === 0) {
          let obj = appList.filter((item) => item.app_id == text);
          return obj[0] && obj[0].name
        }

        return text;
      }
    }, {
      title: '操作',
      dataIndex: 'address',
      key: 'operate',
      className: 'text-left',
      render: (text, rec, index) => {
        return (
          <div>
            <Button
              style={style.list.tableBtn}
              data-label={OPT.EDIT}
              onClick={this.manageRowOperation(rec)}
            >
              <Icon type="uf-pencil-s"/>
            </Button>
            <Popconfirm placement="bottom" onClose={ this.handleDelete(rec) } content="是否要删除当前项？">
              <Button
                style={style.list.tableBtn}
                data-label={OPT.DESTROY}
              >
                <Icon type="uf-del"/>
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }];

    return columns;

  }
  // methods,转发和域名跳转
  gotoDomainList = type => evt => {
    this.props.router.push(`/create/${type}`);
  }

  render() {
    const serviceType = STORAGE_TYPE;
    const {style} = this.props;
    return (
      <Row>
        <WrappedHeader>
          <span>转发策略</span>
        </WrappedHeader>
        <div style={style.body}>
          <div style={style.list.main}>
            <div style={style.list.listBtnGroup}>
              <Button className="u-button-border u-button-primary height-33"
                      style={style.list.listBtnRedirc}
                      onClick={this.showRedir}
              >
                <span className=""></span>&nbsp;添加转发策略
              </Button>
              <Button className="u-button-border u-button-primary height-33"
                      style={style.list.listBtnResh}
                      onClick={this.handleRefresh}
              >
                <span className="cl cl-restar"></span>&nbsp;刷新
              </Button>


            </div>
            <Table
              data={this.state.dataSource}
              rowKey={(rec, index) => {
                return rec[PROPS[serviceType]['id']]
              }}
              columns={this.renderTableColumns()}
              getBodyWrapper={(body) => {
                // 在这里处理刷新页面的逻辑
                return body || (<div>xxx</div>)
              }}
            />
          </div>
        </div>

        {/*<EditModal*/}
        {/*show={this.state.showModal}*/}
        {/*hideModal={this.hideModal}*/}
        {/*serviceType="redirectrule"*/}
        {/*payLoad={this.getModalPayLoad()}*/}
        {/*refresh={ this.handleRefresh }*/}
        {/*data={ this.state.selectedData }*/}
        {/*insId = { this.props.params.id }*/}
        {/*optType={OPT[this.__opType]}*/}
        {/*operation={this[`${OPT_EN[this.__opType]}SelectedInstance`]}*/}
        {/*/>*/}


        <RedirModal
          show={this.state.showRediret}
          insId={ this.props.params.id }
          hideModal={this.hideModal}
          isAdd={ this.state.isAdd }
          serviceType="redirectrule"
          appList={ this.state.appList }
          data={ this.state.dataSource}
          refresh={ this.handleRefresh }
          payLoad={this.getModalPayLoad()}
          optType={OPT[this.__opType]}
          operation={this[`${OPT_EN[this.__opType]}SelectedInstance`]}
        />
      </Row>


    )
  }
}


export default withStyle(() => ({
  body: {
    padding: '20px 10px 50px 10px',

  },
  board: {
    height: '300px',
    width: 220,
    display: 'inline-block',
    marginRight: '20px',
    verticalAlign: 'top',

    manageEntry: {
      display: 'inline-block',
      height: '100%',
      marginLeft: '20px',
      verticalAlign: 'top',
    },

    manageEntryType: {
      paddingTop: '50px',
      fontSize: '20px',
      fontWeight: 'bold',
    },

    manageEntryBtn: {
      width: '100px',
      marginTop: '30px',
      color: 'white',
      borderRadius: 0,
    },
  },
  list: {
    main: {
      display: 'inline-block',
      width: '100%',
      minWidth: '400px',
      minHeight: '400px',
      padding: '20px',
      backgroundColor: 'white',
      overflow: 'hidden',
    },
    listBtnGroup: {},
    listBtnResh: {
      height: 33,
      borderRadius: 0,
      marginBottom: '15px',
      lineHeight: '30px',
      fontSize: '14px',
      padding: '0',
      marginLeft: '20'
    },
    listBtnRedirc: {
      height: 33,
      borderRadius: 0,
      marginBottom: '15px',
      lineHeight: '30px',
      fontSize: '14px',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 15,
      paddingRight: 15,
      backgroundColor: '#1e88e5',
      color: '#fff'
    },
    tableBtn: {
      minWidth: 0,
      border: 'none',
      padding: '0 5px',
      backgroundColor: 'transparent',
      color: '#999',
    },
  },
  Running: {
    background: ' #4caf50',
    ...insStatusStyle
  },
  Checking: {
    background: '#fe7323',
    ...insStatusStyle,
  },
  Unkown: {
    background: ' #ff8a80',
    ...insStatusStyle
  },
  Deploying: {
    background: ' #29b6f6',
    ...insStatusStyle
  },
}))(ListPage)
