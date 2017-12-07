import React, {Component} from 'react';
import {
  Table,
  Button,
  InputGroup,
  FormControl,
  Icon,
  Popconfirm,
  Select,
  Pagination,
  CheckBox,
  Message
} from 'tinper-bee';
import ExtractModal from '../extract-modal';
import EditModal from '../edit-modal';
import Empty from '../empty';
import TransitModal from '../transit';

import {
  CheckConfigIsable,
} from 'serves/appTile';

import {
  GetConfigFileFromCenterByCode,
  GetConfigVersionByCode,
  GetConfigEnvFromCenter,
  editConfigFile,
  deleteApp
} from 'serves/confCenter';

import './index.less';

const Option = Select.Option;

const defaultProps = {
  confCenterId: ''
};

class ConfigCenter extends Component {
  constructor(props) {
    super(props);
    const self = this;
    this.columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      render: function (text, record, index) {
        return index + 1;
      }
    }, {
      title: '名称',
      dataIndex: 'path',
      key: 'path'
    }, {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      width: '60%'
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: this.renderControl.bind(this),
    }];

    this.state = {
      data: [],
      versionList: [],
      envList: [],
      page: 0,
      activePage: 1,
      showExtractModal: false,
      env: '',
      version: '',
      showEditModal: false,
      editData: {},
      isAbleExtract: false,
      error: false,
      showTransitModal: false,
    };

  }

  componentDidMount() {
    let {confCenterId} = this.props;
    if (confCenterId != 0) {
      CheckConfigIsable(`?confCenterId=${confCenterId}`, (res) => {
        this.setState({
          isAbleExtract: !res.data
        })

      });
      //获取环境列表
      GetConfigEnvFromCenter()
        .then((res) => {
          if (res.data.success === 'true') {
            this.setState({
              envList: res.data.page.result,
              env: res.data.page.result[0].value
            });

          } else {
            Message.create({
              content: res.data.result,
              color: 'danger',
              duration: null
            })
          }

        });
      this.getVersion('1');

    }
  }

  componentWillReceiveProps(nextProps) {
    let {confCenterId} = nextProps;
    if (confCenterId != 0) {
      CheckConfigIsable(`?confCenterId=${confCenterId}`, (res) => {
        this.setState({
          isAbleExtract: !res.data
        })

      });
    }
  }

  getVersion = (env) => {
    const {appCode} = this.props;
    if (appCode !== '') {
      //获取版本列表
      GetConfigVersionByCode(`?appCode=${ appCode }&envId=${ env }&needDefine=false`)
        .then((res) => {
        let data = res.data;
          if (data.error_code) {
            this.setState({
              error: true,
            });
            Message.create({
              content: data.error_message,
              color: 'danger',
              duration: null
            })
          } else {
            let version = res.data.page.result.length !== 0 ? res.data.page.result[0].value : '';

            this.setState({
              versionList: res.data.page.result,
              version: version
            });
            this.getConfigFile(env, version);

          }

        });
    }

  };

  /**
   * 获取配置文件列表
   * @param env 环境
   * @param version 版本
   */
  getConfigFile = (env, version, page) => {
    const {appCode} = this.props;
    const {activePage} = this.state;
    if (version === '') {
      this.setState({
        data: [],
        page: 0,
      })

    }else{
      GetConfigFileFromCenterByCode(`?appCode=${ appCode }&envId=${ env }&version=${ version }&pgSize=9&pgNo=${ page ? page : activePage }`)

        .then((res) => {
          if (res.data.success === 'false') {
            Message.create({
              content: res.data.message.field.envId,
              color: 'danger',
              duration: null
            })
          }else{
            let totalpage = Math.ceil(res.data.page.totalCount / 9);
            let fileList = res.data.page.result;
            fileList.forEach((item, index) => {
              item.key = index;
            })

            this.setState({
              data: fileList,
              page: totalpage,
            })
          }

        });
    }
  }


  /**
   * 渲染表格操作
   * @param text
   * @param record
   * @param index
   * @returns {XML}
   */
  renderControl = (text, record, index) => {
    return (
      <span className="cursor-pointer">
                <Icon type="uf-pencil-s" onClick={ this.handleEdit(record, index) }/>
                <Popconfirm content="确认删除?" placement="bottom" onClose={ this.handleDelete(record, index) }>
                    <Icon type="uf-close-bold"/>
                </Popconfirm>
            </span>
    )
  }


  getContent = (record, index) => {

  }


  getHistory = (record, index) => {

  }


  handleEdit = (record, index) => () => {
    this.setState({
      showEditModal: true,
      editData: record
    })
  }


  handleDelete = (record, index) => {
    let {data, env, version, activePage} = this.state;
    return () => {
      deleteApp(record.configId)
        .then((res) => {
          if (res.status === 200) {
            if (data.length === 1) {
              this.getConfigFile(env, version, activePage - 1);
            } else {
              this.getConfigFile(env, version, activePage);
            }
            this.setState({
              data
            });
            Message.create({
              content: '删除成功',
              color: 'success',
              duration: 1.5

            })
          } else {
            Message.create({
              content: res.data.message,
              color: 'danger',
              duration: null
            })
          }
        })
    }
  }


  handleDownload = (record, index) => {

  }

  /**
   * 下拉选择钩子函数
   * @param state
   * @returns {Function}
   */
  handleSelectChange = (state) => {
    const self = this;
    return function (value) {

      if (state === 'env') {
        self.getVersion(value);
      } else if (state === 'version') {
        self.getConfigFile(self.state.env, value);
      }
      self.setState({
        [state]: value,
        activePage: 1,
      })
    }

  }

  /**
   * 选取页码
   * @param value
   */
  handleSelectPage = (value) => {
    this.setState({
      activePage: value,
    })
    this.getConfigFile(this.state.env, this.state.version, value);
  }

  /**
   * 编辑文件框关闭
   */
  handleEidtClose = () => {
    this.setState({
      showEditModal: false
    })
  }

  /**
   * 编辑文件框确认
   */
  handleEidtEnsure = (data, id) => {
    this.setState({
      showEditModal: false
    });
    this.getVersion(this.state.env);
    editConfigFile(data, id, (res) => {
      if (res.data.success === true) {
       // console.log(res);
      }
    })
  }

  /**
   * 提取配置文件框关闭
   */
  handleExtractClose = () => {
    this.setState({
      showExtractModal: false
    })
  }

  /**
   * 提取配置文件框确认
   */
  handleExtractEnsure = () => {
    this.setState({
      showExtractModal: false,
      isAbleExtract: true
    });
    this.getVersion(this.state.env);

  }

  /**
   * 显示提取配置文件框
   */
  showGetFile = () => {
    if (this.state.isAbleExtract) {
      this.setState({
        showTransitModal: true
      })
    } else {
      this.setState({
        showExtractModal: true
      })
    }
  }

  handleTransitClose = () => {
    this.setState({
      showTransitModal: false
    })
  }


  render() {

    const {confCenterId} = this.props;
    let {isAbleExtract, versionList, error} = this.state;
    let showEmpty = false, firstExtract = false;

    if (confCenterId == 0) {
      showEmpty = true;
    } else if (!isAbleExtract && !error && versionList.length === 0) {
      firstExtract = true;
      showEmpty = true;
    } else if (error) {
      showEmpty = true;
    }

    return (
      <div className="config-center">
        {
          showEmpty ? (
            <Empty
              onExtract={ this.showGetFile }
              noConfig={ !firstExtract }
            />
          ) : (
            <div>
              <div className="header">
                <Button
                  shape="squared"
                  colors="primary"
                  onClick={ this.showGetFile }>
                  提取配置文件
                </Button>
                <Select
                  value={ this.state.env}
                  size="lg" className="select-env"
                  onChange={this.handleSelectChange('env')}>
                  {
                    this.state.envList.map(function (item, index) {
                      return (
                        <Option value={item.value} key={ index }>{ item.name }</Option>
                      )
                    })
                  }
                </Select>
                <Select
                  size="lg"
                  value={ this.state.version }
                  className="select-env"
                  onChange={this.handleSelectChange('version')}>
                  {
                    this.state.versionList.map(function (item, index) {
                      return (
                        <Option value={ item.value } key={ index }>{ item.value }</Option>
                      )
                    })
                  }
                </Select>
                {/*<InputGroup simple className="search">*/}
                {/*<FormControl style={{width: 300}} type="text"/>*/}
                {/*<InputGroup.Button shape="border">*/}
                {/*<Icon type="uf-search"> </Icon>*/}
                {/*</InputGroup.Button>*/}
                {/*</InputGroup>*/}
              </div>
              <div>
                <Table data={ this.state.data } columns={ this.columns }/>
                {
                  this.state.page > 1 ? (
                    <Pagination
                      first
                      last
                      prev
                      next
                      items={this.state.page}
                      className="pagenation"
                      maxButtons={5}
                      activePage={this.state.activePage}
                      onSelect={this.handleSelectPage}/>
                  ) : ""
                }

              </div>
            </div>
          )
        }

        <ExtractModal
          configId={ confCenterId }
          show={ this.state.showExtractModal }
          onClose={ this.handleExtractClose }
          onEnsure={ this.handleExtractEnsure }
        />
        <EditModal
          configId={ confCenterId }
          data={ this.state.editData }
          show={ this.state.showEditModal }
          onClose={ this.handleEidtClose }
          onEnsure={ this.handleEidtEnsure }
        />
        {
          TransitModal(this.state.showTransitModal, this.handleTransitClose)
        }
      </div>
    )
  }
}

ConfigCenter.defaultProps = defaultProps;

export default ConfigCenter;
