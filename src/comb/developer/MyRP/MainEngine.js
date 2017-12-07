import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import DeleteEngine from './DeleteEngine';
//import DelLostRPConfirm from './DelLostRPConfirm';
import ErrorModal from 'components/ErrorModal';
import {
  Row,
  Table,
  Button,
  Switch,
  ProgressBar,
  Message,
  Col,
  Tile,
  Modal,
  FormGroup,
  Label,
  FormControl
} from 'tinper-bee';
import style from './index.css';
import {loadShow, loadHide, lintAppListData, getCookie} from 'components/util';

class MainEngine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      deleteModal: false,
      engine: [],
      requireEngine: true,
      modalEngine: false,
      isShowAdmiDel: false,
      isShowUnAdmiDel: false,
      index: ''
    };
  }

  closeEngine = () => {
    this.setState({
      modalEngine: false
    })
  }

  onEngineAdd = () => {
    let { location } = this.props;
    let name = ReactDOM.findDOMNode(this.refs.nameEngine).value;
    if (name) {
      this.setState({
        requireEngine: true
      });
    } else {
      this.setState({
        requireEngine: false
      });
      return;
    }
    this.context.router.push(`/ape/${name}?id=${location.query.id}&type=${location.query.type}`);

  }

  //添加主机
  addEngine= () => {
    let { location } = this.props;
    this.setState({
      modalEngine: true,
      id: location.query.id
    });
  }

  //导入主机
  importEngine = () => {
    alert('导入主机')
  }


  //删除操作
  // 云主机资源池，如果主机失联，则管理员和主机创建者能删除，其他人不能删除，给出相应提示，
  // 若果没有失联，需要判断主机内的容器数，大于0不能删，等于0可以删
  // 私有主机资源池，默认为接入状态，容器数为零或者error_code不为空都在可以删除
  delete1 = (index) => () => {
    let self = this;
    let engine = self.state.engine;
    let id = engine[index].id;
    let ipv4 = engine[index].ipv4;
    let status = engine[index].status;
    let userId = getCookie('userId');
    let providerId = getCookie('u_providerid');
    let user_id = this.props.location.query.userid;
    let type = this.props.location.query.type;

    if (status === '主机失联，等待连接中') {
      if (userId === providerId || user_id === userId) {//管理员账户和创建该主机的用户可以删除
        self.setState({
          isShowAdmiDel: true,
          index: index
        });
      } else {
        self.setState({
          isShowUnAdmiDel: true,
          index: index
        });
      }
    } else {
      axios.get('/res-pool-manager/v1/resource_pool/containers/' + ipv4)
        .then(function (res) {
          // let data = res.data;
          let data = lintAppListData(res);
          if (data == 0 || ( type === 2 && res.error_code == -1 )) {
            axios.delete('/res-pool-api/v1/resource_nodes/' + id).then(function (res) {
              lintAppListData(res, null, '删除成功');
              engine.splice(index, 1);
              self.setState({engine: engine});
            }).catch(function (err) {
              console.log(err);
              return Message.create({content: '请求出错', color: 'danger', duration: null});
            });
          } else {
            return Message.create({content: '很抱歉，此主机不可以删除', color: 'danger', duration: 4.5});
          }
        })
        .catch(function (err) {
          console.log(err);
          return Message.create({content: '请求出错', color: 'danger', duration: null});
        });
    }
  }

  //管理员账户删除确认
  deleteConfirm  = () => {
    let self = this;
    let index = self.state.index;
    let id = self.state.engine[index].id;
    let engine = self.state.engine;
    axios.delete('/res-pool-api/v1/resource_nodes/' + id).then(function (res) {
      lintAppListData(res, null, '删除成功');
      engine.splice(index, 1);
      self.setState({
        engine: engine,
        isShowAdmiDel: false,
      });
    }).catch(function (err) {
      console.log(err);
      return Message.create({content: '请求出错', color: 'danger', duration: null});
    });
  }


  freshData = () => {
    let self = this;
    let id = this.props.location.query.id;
    //loadShow.call(self);
    axios.get('/res-pool-manager/v1/resource_pool/hoststatus/' + id)
      .then(function (res) {
        let hosts = lintAppListData(res);
        let engine = [];
        if (hosts && (hosts != 0) && hosts.length) {
          for (let i = 0; i < hosts.length; i++) {
            let host = hosts[i];
            let en = {
              id: host.id,
              name: host.name,
              //state: '正常',
              ipv4: host.ipv_4,
              cpu: host.cpu_left,
              registry_time: host.registry_time,
              memory: (Number(host.memory_left) / 1024).toFixed(2),
              disk: (Number(host.disk_left) / 1024).toFixed(2),
              status: host.status,
              key: host.id,
            };
            engine.push(en);
          }
          self.setState({
            engine: engine
          })
        }
      })
      .catch(function (err) {
        //loadHide.call(self);
        console.log(err);
        return Message.create({content: '请求出错', color: 'danger', duration: null});
      });
  }

  componentDidMount() {
    //请求接口，设置state
    this.freshData();
  }

  back() {
    window.location.hash = '#/';
  }

  handleClose = () => {
    this.setState({
      isShowAdmiDel: false,
    });
  }


  handleClose2 = () => {
    this.setState({
      isShowUnAdmiDel: false,
    });
  }
  render() {
    const self = this;
    let { location ,params} = this.props;
    let titleName = "";
    if (params.name) {
      titleName = params.name;
    }
    let columns = [
      {title: '主机名称', dataIndex: 'name', key: 'name'},
      {title: 'IP地址', dataIndex: 'ipv4', key: 'ipv4'},
      {title: '状态', dataIndex: 'status', key: 'status'},
      {title: 'CPU剩余', dataIndex: 'cpu', key: 'cpu'},
      {title: '内存剩余(G)', dataIndex: 'memory', key: 'memory'},
      {title: '磁盘剩余(G)', dataIndex: 'disk', key: 'disk'},
      {title: '创建时间', dataIndex: 'registry_time', key: 'registry_time'},
      {
        title: '操作', dataIndex: 'e', key: 'e', render: (text, record, index) => {

        if (location.query.isFree == 1) {
          return ""
        }
        return (
          <span>
                  <DeleteEngine
                    onConfirmDelete={self.delete1(index)}
                    title={ '删除' }
                    />
                </span>
        )
      }
      }
    ];
    return (
      <div className="main-e"><span ref="pageloading"> </span>
        <Modal show={ this.state.modalEngine  } keyboard={false} onHide={ this.close } backdrop={'static'}
               className="mrp-add">
          <div className="mrp-add">
            <Modal.Header >
              <Modal.Title>添加主机</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <FormGroup>
                <Label>主机名称：</Label>
                <FormControl ref="nameEngine" placeholder="请输入主机名称"/>
              </FormGroup>
              <FormGroup className={classnames({'error': true, 'hidden': this.state.requireEngine})}>
                <Label>
                                <span className="verify-warning show-warning">
                                    <i className="uf uf-exc-t-o"/>
                                    请输入主机名称
                                </span>
                </Label>
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={ this.closeEngine } shape="border" style={{marginRight: 50}}>取消</Button>
              <Button onClick={ this.onEngineAdd } colors="primary">确认</Button>
            </Modal.Footer>
          </div>
        </Modal>
        <Row>
          <Col md={12}>
            <div className="head head-zindex">
                    <span className="back" onClick={this.back}>
                        <i className="cl cl-arrow-left"> </i>
                        我的资源池
                    </span>
              <span className="head-title">
                            {location.query.name}
                    </span>

            </div>
          </Col>
        </Row>
        <Row className="main-e-table">
          <h1 md={12} className="text-center"> {titleName}</h1>
          <Col md={12}>
            <div className="main-e-tb">
              <Button colors="info" onClick={this.addEngine}
                      className={classnames({'hidden': Number(location.query.isFree) === 1})}>添加主机</Button>
              {/* <Button onClick={this.importEngine}>导入主机</Button>*/}
            </div>
          </Col>
          <Col md={12} className="tableShow">
            <Table columns={columns} data={this.state.engine} emptyText={() => '当前暂时还没有数据'}/>
          </Col>
        </Row>

        <ErrorModal
          message = "该主机已失联，确定要删除么？"
          show = { this.state.isShowAdmiDel }
          onEnsure = {this.deleteConfirm}
          onClose = {this.handleClose}
          title = "删除"
          buttonTitle = "确定"
          />
        <ErrorModal
          message = "该主机已失联，若要删除请联系管理员！"
          show = { this.state.isShowUnAdmiDel }
          onEnsure = {this.handleClose2}
          onClose = {this.handleClose2}
          title = "删除"
          buttonTitle = "确定"
          />
      </div>
    )
  }
}

MainEngine.contextTypes = {
  router: PropTypes.object
}

export default MainEngine;