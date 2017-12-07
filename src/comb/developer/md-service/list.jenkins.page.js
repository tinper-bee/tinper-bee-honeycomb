// publics
import { Component, PropTypes } from 'react'
import { Button, Table, Message,Row} from 'tinper-bee'
import { withRouter } from 'react-router'

// self components
import withStyle from './component/withStyle.hoc'
import Header from './component/header.component'
import DashBoard from './component/board.component'
import PopupModal from './component/popupModal.component'

import { dateFormat,veredirect } from './util'

// api
import { operation, listQ, renew, checkstatus } from '../serves/middleare'
import verifyAuth from '../components/authPage/check';
// static
import './index.css'
import { logo, STATE, PROPS, OPT, OPT_EN, MILLISECS_IN_A_DAY, insStatusStyle } from './const'
import { splitParam } from '../components/util'

const STORAGE_TYPE = 'jenkins'
const WrappedHeader = withRouter(Header);



class ListPage extends Component {
  static propTypes = {}
  static defaultProps = {}

  state = {
    clickIndex: null,
    dataSource: [],
    showModal: false,
  }
  // none state data
  __modalPayLoad = []
  __opType = ''

  // lifeCyle hooks
  componentDidMount() {
    listQ({ size: 20, index: 0 }, STORAGE_TYPE)
      .then(data => {
        if(data.error_code){
          Message.create({
            content: data.error_message,
            color: 'danger',
            duration: null
          })
        }else{
          if(data.hasOwnProperty('content')){
            this.setState({
              dataSource: data['content'],
            })
          }
        }
      })
  }
  // methods
/*  handleRefresh = () => {


    const serviceType = STORAGE_TYPE;
    const checkStatus = this.state.dataSource.map(s => {
      checkstatus(s, STORAGE_TYPE)
    })
    Promise.all(checkStatus).then(() => {
      listQ({ size: 20, index: 0 }, serviceType)
        .then((data) => {
          this.setState({
            dataSource: data['content'],
          });
        });
    })
      .catch(() => {
        console.log('操作失败')
      })

  }*/

  // methods
  handleRefresh = () => {
    const serviceType = STORAGE_TYPE;
    const checkStatus = this.state.dataSource.map(s => {
      let param = {
        instanceId: s.insId
      }
      checkstatus(splitParam(param), STORAGE_TYPE)
    })
    Promise.all(checkStatus).then(() => {
      listQ({ size: 20, index: 0 }, serviceType)
          .then((data) => {
            this.setState({
              dataSource: data['content'],
            });
          });
    })
        .catch(() => {
          console.log('操作失败')
        })

  }

  /**
   * 管理权限
   * @param rec
   */
  managerAuth = (rec) => {
    return (e) => {
      e.stopPropagation();
      verifyAuth('jenkins',rec, () => {
        this.context.router.push(`/auth/${rec.insName}?id=${rec.pkMiddlewareJenkins}&userId=${rec.userId}&providerId=${rec.providerId}&backUrl=md-service&busiCode=middleware_jenkins`);
      })
    }
  }

  handleRownClick = (rec, index) => {
    if(this.state.clickIndex === rec[PROPS[STORAGE_TYPE]['id']]){
      this.setState({ clickIndex: null})
    }else{
      this.setState({ clickIndex: rec[PROPS[STORAGE_TYPE]['id']] })
    }
  }
  handleExpand = (rec, index) => {
    let serviceType = STORAGE_TYPE;
    return (
        <div style={{ textAlign: 'left' }}>
          <div>
            <span>管理地址：</span>
            <a href={`http://${rec['serviceDomain']}`} target="_blank"  onClick={veredirect(rec)}>
              {`http://${rec['serviceDomain']}`}
            </a>
          </div>

          <div>
            <span>创建时间：</span>
            <span>
              {
                dateFormat(new Date(rec['ts']), 'yyyy年MM月dd日 hh:mm:ss')
              }
            </span>
          </div>
          { rec["description"]==""?"":
          (
            <div>
              <span>描述信息:</span>
              <span>{rec['description']}</span>
            </div>
          )
        }
        </div>
    );
  }
  /* Modal handling methods */
  manageRowOperation = rec => evt => {
    /* use simple factory now.
    * if complicated,change to use factory method
    */
    const type = evt.target.dataset.label;
    this.__opType = type;
    this.setModalPayLoad([rec]);
    this.setState({ showModal: true });
  }

  getModalPayLoad = () => {
    return this.__modalPayLoad || [];
  }
  setModalPayLoad = (payLoad) => {
    this.__modalPayLoad = payLoad;
  }
  hideModal = () => {
    this.setState({ showModal: false });
  }

  /* instance processing methods:
   * destroy renewal
   * start stop restart changepassword are about to be added
   */
  destroySelectedInstance = () => {
    let dataParam=[{
          "id":this.__modalPayLoad[0].pkMiddlewareJenkins,
          "servicePort": this.__modalPayLoad[0].servicePort+"",
              "insId":    this.__modalPayLoad[0].insId
    }];
    operation(dataParam, STORAGE_TYPE, OPT.DESTROY)
        .then(() => {
          this.setState({ showModal: false });
          this.handleRefresh();
        });
  }
  renewalSelectedInstance = () => {
    renew(splitParam({id: this.__modalPayLoad[0].pkMiddlewareJenkins}), STORAGE_TYPE)
        .then(() => {
          this.setState({ showModal: false });
          this.handleRefresh();
        })
  }

  // renders
  renderTableColumns = () => {
    let serviceType = STORAGE_TYPE
    const { style } = this.props;

    const columns = [{
      title: '名称',
      dataIndex: PROPS[serviceType]['insName'],
      key: 'name',
    }, {
      title: '运行状态',
      dataIndex: 'insStatus',
      key: 'insStatus',
      render: (text, rec) => {
        return (
          <div style={this.props.style[text]}>
            {STATE[STATE[text]]}
          </div>
        )
      }
    }, {
      title: '规格(MB)',
      dataIndex: 'memory',
      key: 'memory',
    }, {
      title: '剩余时间',
      dataIndex: 'deathtime',
      key: 'deathTime',
      render: (text) => {
        const time = parseInt(text);
        const now = Date.now();
        const left = (time - now) / MILLISECS_IN_A_DAY;
        const day = parseInt(left);
        const hour = Math.floor((left - day) * 24);
        const minute = parseInt(((left - day) * 24 - hour) *60);

        if(day == 0){
          if(hour == 0){
            return `${minute}分`;
          }
          else{
            return `${hour}小时${minute}分`;
          }
        }
        else{
          return `${day}天${hour}小时`;
        }
      }
    }, {
      title: '操作',
      dataIndex: 'address',
      key: 'operate',
      render: (text, rec, index) => {
        return (
          <div>
            <Button
              style={style.list.tableBtn}
              data-label={OPT.AUTH}
              onClick={this.managerAuth(rec)}
            >
              { OPT[OPT.AUTH] }
            </Button>
            <Button
              style={style.list.tableBtn}
              data-label={OPT.DESTROY}
              onClick={this.manageRowOperation(rec)}
            >
              {OPT[OPT.DESTROY]}
            </Button>
            {
              rec['renewal'] === 'Y' ? true :
                (<Button
                  style={style.list.tableBtn}
                  data-label={OPT.RENEWAL}
                  onClick={this.manageRowOperation(rec)}
                >
                  {OPT[OPT.RENEWAL]}
                </Button>)
            }
          </div>
        )
      }
    }];

    return columns;

  }
  render() {
    const serviceType = STORAGE_TYPE
    const { style } = this.props;
    return (
      <Row>
        <WrappedHeader>
          <span>服务列表</span>
        </WrappedHeader>
        <Row>
          <div style={style.body}>
            <div style={style.board}>
              <DashBoard
                logo={logo[STORAGE_TYPE]}
                type={STORAGE_TYPE}
                hideNumber
              >
                <div style={style.board.manageEntryType}>
                  Jenkins
                </div>
                <Button style={style.board.manageEntryBtn} className="u-button-primary"
                  onClick={() => { this.props.router.replace(`/create/${STORAGE_TYPE}`) }}
                >
                  创建服务
                </Button>
              </DashBoard>
            </div>
            <div style={style.list.main}>
              <div style={style.list.listBtnGroup}>
                <Button className="u-button-border u-button-primary"
                  style={style.list.listBtn}
                  onClick={this.handleRefresh}
                >
                  <span className="cl cl-restar"></span>&nbsp;刷新
                </Button>
              </div>
              <Table
                expandIconAsCell
                expandRowByClick
                expandedRowKeys={[this.state.clickIndex]}
                onRowClick={this.handleRownClick}
                expandedRowRender={this.handleExpand}
                data={this.state.dataSource}
                rowKey={(rec, index) => { return rec[PROPS[serviceType]['id']] }}
                columns={this.renderTableColumns()}
                getBodyWrapper={(body) => {
                  // 在这里处理刷新页面的逻辑
                  return body || (<div>xxx</div>)
                }}
              />
            </div>
          </div>
        </Row>
        <PopupModal
          show={this.state.showModal}
          hideModal={this.hideModal}
          serviceType="jenkins"
          payLoad={this.getModalPayLoad()}
          optType={OPT[this.__opType]}
          operation={this[`${OPT_EN[this.__opType]}SelectedInstance`]}
        />
      </Row>
    )
  }
}

ListPage.contextTypes = {
  router: PropTypes.object
}

export default withStyle(() => ({
  body: {
    padding: '20px 40px 50px 40px',

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
      width: 'calc(100% - 245px)',
      minWidth: '400px',
      minHeight: '400px',
      padding: '20px',
      backgroundColor: 'white',
      overflow: 'hidden',
    },
    listBtnGroup: {
      textAlign: 'right',
    },
    listBtn: {
      borderRadius: 0,
      marginBottom: '15px',
      lineHeight: '30px',
      fontSize: '14px',
      padding: '0',
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
    background: '#4caf50',
    ...insStatusStyle,
  },
  Checking: {
    background: '#fe7323',
    ...insStatusStyle,
  },
  Unkown: {
    background: '#ff8a80',
    ...insStatusStyle,
  },
  Deploying: {
    background: '#29b6f6',
    ...insStatusStyle,
  },

}))(ListPage)