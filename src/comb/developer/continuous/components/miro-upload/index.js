import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {
  Tile,
  Col,
  Form,
  FormGroup,
  FormControl,
  Label,
  Row,
  Icon,
  Radio,
  Button,
  Select,
  Message,
  Upload,
  ProgressBar,
  Popconfirm,
  Panel,
  Modal,
  Checkbox
} from 'tinper-bee';
import {Link} from 'react-router'
import {getUploadWarInfo, verifyImage, updateAppUpload} from 'serves/CI';

import {guid, splitParam, getCookie, lintAppListData} from 'components/util'
import {verify} from '../../../../lib/verification'
import {ImageIcon} from 'components/ImageIcon';
import ErrorModal from 'components/ErrorModal';

import {err, success, warn} from 'components/message-util';
import {DOCKER_IMAGES} from '../../constant';
import { getNotice, verifyIsSupportGitbuild} from '../../utils';

import './index.less';


let warUrl = "";

class MiroUploadModal extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      appName: "",
      appCode: "",
      baseImage: "",
      imageVersion: "",
      imageName: "",
      describes: "",
      selectedInv: 'tomcat:6.0.48-jre8-alpine',
      selectedImage: "cata",
      imageUrl: null,
      appUrl: "",
      formData: {},
      url: "",
      warPrefix: '',
      imgPrefix: '',
      imagePath: null,
      is_root_path_access: true,
      totalSize: 0,
      loadSize: 0,
      progress: 0,
      warName: '',
      showProgress: false,
      selectImg: 'default-png',
      showDefaultSelect: false,
      showModal: false,
      appType: 'j2ee',
      exposePort: '8080',
      cmdRun: '',
      env: "1",
      warList: [],
      imageRepeat: false,
      gitFlag: false
    };
    this.isCoverImage = false;

  }

  componentWillReceiveProps(next) {
    let {list} = next;
    this.setState({
      showModal: next.showModal,
      imageVersion: "",
      imageName: list.appCode
    });
  }

  close = () => {
    const {hideModal} = this.props;
    this.setState({
      showModal: false,
      warList: [],
      imageVersion: "",
      imageRepeat: false,
      appUrl: "",
      gitFlag: false,
    });
    this.isCoverImage = false;
    if (hideModal instanceof Function) {
      hideModal();
    }
  }
  /**
   * 校验镜像名称
   */
  verifyImageName = () => {
    const {list} = this.props;
    let {imageName} = this.state;

    let name = `dockerhub.yonyoucloud.com/${getCookie('u_providerid')}/${imageName}:${list.version}`;
    if (window.location.hostname === '117.78.45.139' || window.location.hostname === 'localhost') {
      name = `192.168.32.10:5001/${getCookie('u_providerid')}/${imageName}:${list.version}`;
    }


    verifyImage(name).then((res) => {
      let data = lintAppListData(res);

      if (data.success === 'true') {
        this.setState({
          imageRepeat: true
        });
      } else {
        this.setState({
          imageRepeat: false
        });
      }
    })
  }


  /**
   * 上传应用回调函数
   * @param file 当前上传的文件
   * @param fileList 已上传文件列表
   * @returns {*} 返回false会取消上传动作
   */
  beforeUploadWar = (file, fileList) => {

    const self = this;
    let isLt2M = true;
    if (file.size) {
      isLt2M = file.size / 1024 / 1024 < 200;
    }

    if (!isLt2M) {
      warn('请上传小于200MB的文件!');
      return isLt2M;
    }

    //同步获取上传必要信息
    return getUploadWarInfo((res) => {
      let data = JSON.parse(res);

      let formData = this.state.formData;

      formData.key = data.perfix + '${filename}';
      formData.policy = data.policy;
      formData.OSSAccessKeyId = data.accessid;
      formData.success_action_status = '200';
      formData.callback = data.callback;
      formData.signature = data.signature;
      formData.name = file.name;
      warUrl = data.host;
      this.setState({
        formData: formData,
        warPrefix: data.perfix,
        warName: file.name,
        showProgress: true,
      });
    });
  }

  /**
   * 下拉框选取事件
   * @param state 当前设置的state
   * @returns {Function}
   */
  handleSelect = (state) => (value) => {
    if (state === 'appType') {
      this.setState({
        selectedInv: DOCKER_IMAGES[value][0].value
      })
    }

    this.setState({
      [state]: value
    })
  }

  /**
   * 输入框绑定事件
   * @param state 当前绑定的state
   * @returns {Function}
   */
  handleValueChange = (state) => (e) => {
    this.setState({
      [state]: e.target.value
    })
  }

  /**
   * 上传事件监听
   * @param info 上传信息
   */
  handleUploadWar = (info) => {

    //只上传一个
    let warList = info.fileList;
    warList = warList.slice(-1);

    this.setState({
      warList
    });

    if (info.file.response) {
      if (info.file.response.Status === 'OK') {
        let prefix = this.state.warPrefix;
        let name = prefix + info.file.name;

        this.setState({
          appUrl: name,
          gitFlag: false
        });

      } else {
        err("上传失败");
        this.setState({
          appUrl: ""
        });
      }
    }
  }


  /**
   * 提交事件
   */
  handleSubmit = () => {
    let {list, refresh} = this.props;
    let {imageName} = this.state;

    if (!this.state.gitFlag && (this.state.appUrl === "" || !this.state.appUrl)) {
      return warn("请先上传应用。");
    }

    if (this.state.imageName === '') {
      return warn("请输入镜像名称。");
    }

    if (!verify(imageName, 'string')) {

      return warn("镜像名称格式不正确。");
    }

    if (this.state.imageRepeat) {
      return warn('镜像名称重复，请重新填写。');
    }

    let logid = guid();
    if (this.state.gitFlag && (!list.gitUrl || list.gitUrl === '')) {
      return warn('请先到代码源页签完善代码源信息。');
    }
    let postFix = this.state.appUrl.split('.').pop();
    if (!this.state.gitFlag) {
      switch (this.state.appType) {
        case 'j2ee':
          if (postFix !== 'war') {
            return warn('java Web应用只能上传.war格式的应用包。')
          }
          break;
        case 'j2se':
          if (postFix !== 'jar' && postFix !== 'zip') {
            return warn('java应用只能上传.jar格式或者.zip格式的应用包。')
          }
          break;
        case 'dubbo':
          break;
        default:
          if (postFix !== 'zip' && postFix !== 'gz') {
            return warn('当前应用类型只能上传.zip格式或者.tar.gz格式的应用包。')
          }

      }
    }

    let param = {
      appUploadId: list.appUploadId,
      logId: logid,
      version: list.version,
      uploadPath: this.state.appUrl,
      appName: list.appName,
      appCode: list.appCode || this.state.appCode,
      baseImage: this.state.selectedInv,
      describes: list.describes,
      icon: list.icon,
      imageName: this.state.imageName,
      is_root_path_access: this.state.is_root_path_access,
      is_cover_image: false,
      appType: this.state.appType,
      exposePort: list.exposePort,
      cmdRun: list.cmdRun,
      env: list.env,
      git_flag: this.state.gitFlag,
      gitUserName: list.gitUserName,
      gitPassWord: list.gitPassWord,
      gitUrl: list.gitUrl,
      ssh_flag: list.ssh_flag,
      idRsaPath: list.idRsaPath,
    };
    this.close();

    updateAppUpload(`?encryp=false`, param).then((response) => {

      let newUploadList = lintAppListData(response, null, null);
      if (newUploadList.error_code) {
        err(newUploadList.error_message);
      } else {
        refresh && refresh();
        this.context.router.push(`/upload_detail/${response.data.appUploadId}`);
      }
    })
  }

  /**
   * 弹出框关闭事件，清空imagename
   */
  handleClose = () => {

    this.setState({
      imageRepeat: false,
      imageVersion: '',
      gitFlag: false
    });

  }

  removeWar = () => {

    this.setState({
      appUrl: ''
    });

  }
  /**
   * 确认覆盖镜像
   */
  handleEnsure = () => {
    this.setState({
      imageRepeat: false,
    });
    this.isCoverImage = true;
  }

  /**
   * 清除镜像
   */
  clearImg = () => {
    this.setState({
      selectImg: "default-png",
      imagePath: null,
    })
  }

  /**
   * 捕获checkbox的改变
   */
  handleCheckboxChange = () => {
    let {is_root_path_access} = this.state;
    this.setState({
      is_root_path_access: !is_root_path_access
    })
  }

  /**
   * 源码构建
   */
  gitBuild = () => {
    let {list} = this.props;
    if (list.gitUrl && list.gitUrl !== '') {
      this.setState({
        gitFlag: true
      })
    } else {
      this.close();
    }
  }

  render() {

    const {list} = this.props;
    let path = this.props.location && this.props.location.query && this.props.location.query.route;

    let uploadHelper = (<div className="upload-help">{getNotice(this.state.appType)}</div>);
    if (this.state.gitFlag) {
      uploadHelper = (<div className="upload-help">{`已使用${list.gitUrl}源码构建。`}</div>);
    } else {
      if (this.state.appType === 'j2ee') {
        uploadHelper = (
          <div className="upload-help">
            <p>*仅可上传类型为.war格式，并大小为不超过200MB的文件</p>
            <p>*源码构建的信息可以去代码源页签修改。</p>
          </div>
        );
      }
    }
    let popContent = (<div style={{width: 270, wordBreak: 'break-all'}}>当前无源码信息，请去源代码页签完善信息。</div>);

    if (list.gitUrl && list.gitUrl !== '') {
      popContent = (<div style={{width: 270, wordBreak: 'break-all'}}>{`确认使用${list.gitUrl}代码进行构建?`}</div>);

    }

    return (
      <Modal
        show={this.state.showModal}
        onHide={this.close}>
        <Modal.Header>
          <Modal.Title>更新版本</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Row className="create-app-page">
            <Form horizontal style={{marginTop: 0}}>

              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>镜像名称</Label>
                  </Col>
                  <Col sm={6} xs={6}>

                    <FormControl
                      placeholder="请输入数字、字母、下划线、斜线、中划线"
                      maxLength="100"
                      onBlur={this.verifyImageName}
                      value={this.state.imageName}
                      onChange={this.handleValueChange("imageName")}
                    />

                    {
                      this.state.imageRepeat ? (
                        <span>镜像名称重复，请修改。</span>
                      ) : null
                    }

                  </Col>
                </FormGroup>
              </Row>
              {!list.appCode &&
              (
                <Row>
                  <FormGroup>
                    <Col md={3} sm={2} className="text-right">
                      <Label>应用编码</Label>
                    </Col>
                    <Col md={6} sm={6}>
                      <FormControl
                        placeholder="请输入数字、字母、下划线、斜线、中划线"
                        maxLength="100"
                        value={this.state.appCode}
                        onChange={this.handleValueChange("appCode")}
                      />
                    </Col>
                  </FormGroup>
                </Row>
              )
              }
              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>应用分类</Label>
                  </Col>
                  <Col sm={6} xs={6}>
                    <Select
                      value={this.state.appType}
                      dropdownStyle={{zIndex: '9999'}}
                      onChange={this.handleSelect('appType')}>
                      <Option value="j2ee">Java Web应用</Option>
                      <Option value="dubbo">Dubbo应用</Option>
                      <Option value="j2se">Java应用</Option>
                    </Select>
                  </Col>

                </FormGroup>
              </Row>
              {
                list.appType === 'nodejs' || list.appType === 'python' || list.appType === 'j2se' || list.appType === 'go' ? (
                  <Row>
                    <FormGroup className="clearfix margin-top-20 margin-bottom-0">
                      <Col sm={3} xs={4} className="text-right">
                        <Label>{list.appType === 'go' ? '启动文件路径' : '启动命令'}</Label>
                      </Col>
                      <Col sm={6} xs={6}>
                        <textarea
                          rows="2"
                          style={{width: '100%'}}
                          value={this.state.cmdRun}
                          onChange={this.handleValueChange('cmdRun')}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="clearfix margin-top-20 margin-bottom-0">
                      <Col sm={3} xs={4} className="text-right">
                        <Label>代理端口</Label>
                      </Col>
                      <Col sm={6} xs={6}>
                        <FormControl
                          value={this.state.exposePort}
                          onChange={this.handleValueChange('exposePort')}/>
                      </Col>
                    </FormGroup>
                  </Row>
                ) : ""
              }
              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>基础镜像</Label>
                  </Col>
                  <Col sm={6} xs={6}>
                    <Select
                      value={this.state.selectedInv}
                      dropdownStyle={{zIndex: '9999'}}
                      onChange={this.handleSelect('selectedInv')}>
                      {
                        DOCKER_IMAGES[this.state.appType].map((item, index) => {
                          return (
                            <Option value={item.value}>{item.name}</Option>
                          )
                        })
                      }
                    </Select>

                  </Col>
                </FormGroup>
              </Row>
              <Row>
                {
                  this.state.appType === 'j2ee' ? (
                    <FormGroup className="root-checkbox">
                      <Col md={6} sm={6} smOffset={3} xsOffset={4}>
                        <Label>
                          <Checkbox
                            checked={this.state.is_root_path_access}
                            onChange={this.handleCheckboxChange}
                            style={{marginRight: 10}}
                          />
                          是否根目录
                        </Label>
                      </Col>
                    </FormGroup>
                  ) : ""
                }
              </Row>
              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>应用上传</Label>
                  </Col>
                  <Col sm={8} xs={8}>
                    <Upload
                      listType="text"
                      multiple={false}
                      fileList={this.state.warList}
                      data={this.state.formData}
                      action={warUrl}
                      className="upload-attach"
                      onRemove={this.removeWar}
                      beforeUpload={this.beforeUploadWar}
                      onChange={this.handleUploadWar}>
                      <Button colors="primary"
                              shape="squared">
                        <Icon type="uf-upload"/> 上传应用包
                      </Button>
                    </Upload>
                    {
                      verifyIsSupportGitbuild(this.state.appType) ? (
                        <Popconfirm
                          color='dark'
                          onClose={this.gitBuild}
                          content={popContent}>
                          <Button
                            shape="squared"
                            className="git-build"
                            colors="primary">
                            <Icon type="uf-treeadd"/>
                            源码构建
                          </Button>
                        </Popconfirm>
                      ) : null
                    }

                    {
                      uploadHelper
                    }

                  </Col>
                </FormGroup>
              </Row>

            </Form>
          </Row>
        </Modal.Body>

        <Modal.Footer className="text-center">
          <Button onClick={this.close} shape="squared" style={{marginRight: 50}}>取消</Button>
          <Button colors="primary" shape="squared" onClick={this.handleSubmit}>确定</Button>
        </Modal.Footer>
      </Modal>


    )
  }
}

MiroUploadModal.contextTypes = {
  router: PropTypes.object
};

export default MiroUploadModal;
