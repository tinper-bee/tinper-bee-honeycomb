import React, {Component, PropTypes} from 'react';
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
  Panel
} from 'tinper-bee';
import {create, getUplodImgInfo, getUplodWarInfo, verifyImage} from 'serves/CI'
import {guid, getCookie, lintAppListData} from 'components/util'
import Title from 'components/Title';
import {verify} from 'lib/verification'
import Checkbox from 'rc-checkbox'
import classnames from 'classnames';
import {ImageIcon} from 'components/ImageIcon';
import ErrorModal from 'components/ErrorModal';

import './index.less';
import 'rc-checkbox/assets/index.css'

const env = {
  dev: '1',
  test: '2',
  stage: '3',
  online: '4'
};

const Option = Select.Option;

const images = {

  j2ee: [
    {
      name: 'Tomcat:6.0.48-JRE8',
      value: 'tomcat:6.0.48-jre8-alpine',
    },
    {
      name: 'Tomcat:6.0.48-JRE7',
      value: 'tomcat:6.0.48-jre7-alpine',
    },
    {
      name: 'Tomcat:7.0.75-JRE8',
      value: 'tomcat:7.0.75-jre8-alpine',
    },
    {
      name: 'Tomcat:7.0.75-JRE7',
      value: 'tomcat:7.0.75-jre7-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JRE8',
      value: 'tomcat:8.0.32-jre8-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JRE7',
      value: 'tomcat:8.0.32-jre7-alpine',
    },
    {
      name: 'Tomcat:9.0.0.M9-JRE8',
      value: 'tomcat:9.0.0.M9-jre8-alpine',
    },
    {
      name: 'Tomcat:9.0.0.M9-JRE7',
      value: 'tomcat:9.0.0.M9-jre7-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JDK7-apm',
      value: 'tomcat:8.0.32-jdk7-apm-alpine-192',
    },
  ],
  nodejs: [
    {
      name: 'nodejs: 6.9.2',
      value: 'nodejs: 6.9.2',
    }
  ],
  nginx: [
    {
      name: 'nginx: latest',
      value: 'nginx: latest',
    }
  ],
  python: [
    {
      name: 'python: 2.7',
      value: 'python: 2.7',
    }
  ],
  go: [
    {
      name: 'go: alpine:3.4',
      value: 'go: alpine:3.4',
    }
  ],
  dubbo: [
    {
      name: 'Tomcat:6.0.48-JRE8',
      value: 'tomcat:6.0.48-jre8-alpine',
    },
    {
      name: 'Tomcat:6.0.48-JRE7',
      value: 'tomcat:6.0.48-jre7-alpine',
    },
    {
      name: 'Tomcat:7.0.75-JRE8',
      value: 'tomcat:7.0.75-jre8-alpine',
    },
    {
      name: 'Tomcat:7.0.75-JRE7',
      value: 'tomcat:7.0.75-jre7-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JRE8',
      value: 'tomcat:8.0.32-jre8-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JRE7',
      value: 'tomcat:8.0.32-jre7-alpine',
    },
    {
      name: 'Tomcat:9.0.0.M9-JRE8',
      value: 'tomcat:9.0.0.M9-jre8-alpine',
    },
    {
      name: 'Tomcat:9.0.0.M9-JRE7',
      value: 'tomcat:9.0.0.M9-jre7-alpine',
    }
  ],

  php: [
    {
      name: 'php: 7.1.6',
      value: 'php: 7.1.6',
    },
  ],
  j2se: [
    {
      name: 'tomcat:8.0.43-jdk7-alpine',
      value: 'tomcat:8.0.43-jdk7-alpine',
    },
    {
      name: 'tomcat:8.0.43-jdk8-alpine',
      value: 'tomcat:8.0.43-jdk8-alpine',
    },
  ]

};

const imageArray = [
  'alpinelinux-png',
  'centos-png',
  'docker-png',
  'elasticsearch-png',
  'fedora-png',
  'haproxy-png',
  'java-png',
  'jenkins-png',
  'jre-png',
  'mysql-png',
  'nginx-png',
  'nodejs-png',
  'php-png',
  'python-png',
  'rabbitmq-png',
  'redis-png',
  'registry-png',
  'tomcat-png',
  'ubuntu-png',
  'wordpress-png',
  'zookeeper-png'
];

const colorArray = [
  'bg-blue-700', 'bg-orange-600', 'bg-red-A100', 'bg-cyan-500', 'bg-green-500', 'bg-light-blue-400'
]


let warUrl = "";
let imgUrl = "";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class CreateApp extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      appName: "",
      appCode: "",
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
      fileList: [], //配置文件列表，限制只传一个配置文件
      warList: [], //压缩包列表，限制只传一个压缩包
      uuid: ''
    };
    this.isCoverImage = false;
  }

  componentDidMount() {
    this.setState({
      u_providerId: getCookie('u_providerid')
    })
  }

  /**
   * 校验镜像名称
   * @param callback
   */
  verifyImageName = (callback) => {
    const self = this;
    let name = `dockerhub.yonyoucloud.com/${this.state.u_providerId}/${this.state.imageName}:${this.state.imageVersion}`;

    if (window.location.hostname === '117.78.45.139' || window.location.hostname === 'localhost') {
      name = `192.168.32.10:5001/${this.state.u_providerId}/${this.state.imageName}:${this.state.imageVersion}`;
    }

    verifyImage(name).then((res) => {
      let data = lintAppListData(res);

      if (data.success === 'true' && !self.isCoverImage) {
        self.setState({
          showModal: true
        });
      } else {
        callback();
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
    // if (this.appUrl) {
    //     Message.create({content: '请先删除已上传的应用包', color: 'warning', duration: 4.5});
    //     return false;
    // }

    const self = this;
    let isLt2M = true;
    if (file.size) {
      isLt2M = file.size / 1024 / 1024 < 200;
    }

    if (!isLt2M) {
      Message.create({content: '请上传小于200MB的文件!', color: 'danger'});
      return isLt2M;
    }

    //同步获取上传必要信息
    return getUplodWarInfo(function (res) {
      let data = JSON.parse(res);

      let formData = self.state.formData;

      formData.key = data.perfix + '${filename}';
      formData.policy = data.policy;
      formData.OSSAccessKeyId = data.accessid;
      formData.success_action_status = '200';
      formData.callback = data.callback;
      formData.signature = data.signature;
      formData.name = file.name;
      warUrl = data.host;
      self.setState({
        formData: formData,
        warPrefix: data.perfix,
        warName: file.name,
        showProgress: true,
      });
    });
  }

  /**
   * 上传图片前的回调
   * @param file 当前上传文件
   * @param fileList 上传文件列表
   * @returns {*} 返回false会中断上传动作
   */
  beforeUploadImg = (file, fileList) => {

    const self = this;
    let isJPG = true, isLt2M = true;
    if (file.type) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
      if (!isJPG) {
        Message.create({content: '图片格式错误!', color: 'danger'});
        return isJPG;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        Message.create({content: '图片过大，请换用小于2MB的图片!', color: 'danger'});
        return isLt2M;
      }
    }

    //同步获取上传信息
    return getUplodImgInfo(function (res) {
      let data = JSON.parse(res);
      let formData = self.state.formData;

      formData.key = data.perfix + '${filename}';
      formData.policy = data.policy;
      formData.OSSAccessKeyId = data.accessid;
      formData.success_action_status = '200';
      formData.callback = data.callback;
      formData.signature = data.signature;
      formData.name = file.name;
      imgUrl = data.host;

      self.setState({
        formData: formData,
        imgPrefix: data.perfix
      });
    });

  }

  /**
   * 选取默认图片或图标
   * @param value 当前选取的值
   * @returns {Function}
   */
  selectDefault = (value) => {
    const self = this;
    return function () {
      self.setState({
        selectImg: value,
        imagePath: null,
      })
    }
  }

  /**
   * 设置默认的图标
   * @param value 当前选取的值
   * @constructor
   */
  ChangeInv = (value) => {
    this.setState({selectedInv: value});
  }

  /**
   * 设置默认的图片
   * @param value 当前选取的值
   * @constructor
   */
  ChangeImage = (value) => {
    this.setState({selectedImage: value});
  }

  /**
   * 下拉框选取事件
   * @param state 当前设置的state
   * @returns {Function}
   */
  handleSelect = (state) => {
    const self = this;
    return function (value) {
      if (state === 'appType') {
        self.setState({
          selectedInv: images[value][0].value
        })
      }
      self.setState({
        [state]: value
      })
    }
  }

  /**
   * 输入框绑定事件
   * @param state 当前绑定的state
   * @returns {Function}
   */
  handleValueChange = (state) => {
    const self = this;

    return function (event) {

      self.setState({
        [state]: event.target.value
      })
    }
  }

  /**
   * 上传事件监听
   * @param info 上传信息
   */
  handleUploadWar = (info) => {
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
        });

      } else {
        Message.create({content: "上传失败", color: 'danger'});
        this.setState({
          appUrl: ""
        });
      }
    }

  }

  /**
   * 默认图片菜单收起
   */
  packUp = () => {
    this.setState({
      showDefaultSelect: false
    })
  }

  /**
   * 默认图片菜单展开
   */
  packDown = () => {
    this.setState({
      showDefaultSelect: true
    })
  }

  /**
   * 提交事件
   */
  handleSubmit = () => {
    const self = this;
    let { appType } = this.state;
    if (this.state.appUrl === "" || !this.state.appUrl) {
      Message.create({content: "请先上传应用", color: 'danger'});
      return;
    }
    if (this.state.imageUrl === "" && this.state.selectImg === "") {
      Message.create({content: "请先上传图片或者选择默认图标", color: 'danger'});
      return;
    }
    if (this.state.appName === "" || this.state.imageVersion === "") {
      Message.create({content: "参数不能为空", color: 'danger'});
      return;
    }


    if (!verify(this.state.imageName, 'string')) {
      Message.create({content: "镜像名称格式不正确", color: 'warning'});
      return;
    }
    if (!verify(this.state.imageVersion, 'version')) {
      Message.create({content: "镜像版本格式不正确", color: 'warning'});
      return;
    }
    let logid = guid();
    let iconDefault = !this.state.imageUrl;
    let is_root_path_access = true;

    if(appType === 'java'){
      appType = 'j2ee';
    }


    if (appType === 'j2ee') {
      is_root_path_access = this.state.is_root_path_access;
    }

    if(this.state.describes.length > 255){
      return Message.create({
        content: '描述文件最大限制为255个字符，请重新输入。',
        color: 'warning',
        duration: 4.5
      })
    }
    const data = {
      appName: this.state.appName,
      appCode: this.state.appCode,
      baseImage: this.state.selectedInv,
      version: this.state.imageVersion,
      describes: this.state.describes,
      icon: this.state.imageUrl ? this.state.imageUrl : this.state.selectImg,
      uploadPath: this.state.appUrl,
      imageName: this.state.imageName,
      is_root_path_access: is_root_path_access,
      isCoverImage: this.isCoverImage,
      appType: appType,
      exposePort: this.state.exposePort,
      cmdRun: this.state.cmdRun,
      env: this.state.env,
      descFileId: this.state.uuid
    };

    let param = `?logid=${logid}&iconDefault=${iconDefault}`;

    this.verifyImageName(function () {
      create(data, param).then((response) => {

        let newUploadList = lintAppListData(response, null, null);
        sessionStorage.setItem("uploadList", JSON.stringify(newUploadList));
        if (response.data.error_code) {
          Message.create({content: response.data.error_message, color: 'danger'})

        } else {

          self.context.router.push(`/upload_detail/${response.data.appUploadId}`);

        }
      })
    })
  }

  /**
   * 捕获checkbox的改变
   * @param e
   */
  handleCheckboxChange = (e) => {
    this.setState({
      is_root_path_access: e.target.checked
    })
  }

  /**
   * 选择配置环境
   */
  changeEnv = (value) => {
    this.setState({
      env: value
    })
  }
  /**
   * 图片上传钩子函数
   * @param info 上传信息， ie9不兼容
   */
  handleImgUploadChange = (info) => {

    if (info.file.response) {
      if (info.file.response.Status === 'OK') {
        let prefix = this.state.imgPrefix;
        this.setState({
          imageUrl: prefix + info.file.name,
          imagePath: `${info.file.response.iconPath}/${prefix}${info.file.name}`,
          selectImg: "",
        });
        Message.create({content: "上传成功", color: 'success'});
      } else {
        Message.create({content: "上传失败", color: 'danger'});
      }
    }

  }


  /**
   * 弹出框关闭事件，清空imagename
   */
  handleClose = () => {
    this.setState({
      showModal: false,
      imageName: '',
      imageVersion: '',
    });

  }

  /**
   * 确认覆盖镜像
   */
  handleEnsure = () => {
    this.setState({
      showModal: false,
    });
    this.isCoverImage = true;
    this.handleSubmit();

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

  beforeUploadFile = (file, fileList) => {
    const self = this;
    let isJPG = true, isLt2M = true;
    this.setState({
      uuid: guid()
    });
    if (file.type) {

    }

  }

  removeWar = () => {
    this.setState({
      appUrl: "",
    });
  }

  handleUploadFile = (info) => {
    let fileList = info.fileList;

    fileList = fileList.slice(-1);

    if (info.file.response) {

      let data = info.file.response, uploadData = {}, confData = {};
      if (data.hasOwnProperty('error_code')) {
        return  Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        });
      }
      try {
        if (data.modules instanceof Array) {
          data.modules.forEach((item, index) => {
            if (item.module_name.toLocaleLowerCase() === 'upload_module') {
              uploadData = item.content;
            } else if (item.module_name.toLocaleLowerCase() === 'confcenter_module') {
              confData = item.content;
            }
          })
        }
        if (uploadData.appType === 'java') {
          uploadData.appType = 'j2ee';
        }
        this.setState({
          appName: data.appName,
          appCode: confData.appCode,
          imageVersion: data.version,
          selectedInv: uploadData.baseImage,
          imageName: uploadData.imageName,
          is_root_path_access: uploadData.is_root_path_access,
          appType: uploadData.appType,
          env: env[data.environment]
        })

      } catch (e) {
        Message.create({
          content: '您上传的描述文件格式错误，或内部错误。请审查描述文件，或手动填写',
          color: 'danger',
          duration: null
        })
      }
    }

    this.setState({fileList});
  }

  render() {
    const self = this;
    let path = this.props.location.query.route;
    let pathProps = {};
    if (path) {
      pathProps = {
        path: path,
        isRouter: false
      }
    }

    return (
      <div className="create-app-page">
        <Title name="创建新应用" {...pathProps} />
        <Col lg={8} md={10} sm={12}>
          <Form horizontal className="create-app">
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>上传描述文件</Label>
                </Col>
                <Col sm={5} xs={4}>
                  <Upload
                    listType="text"
                    fileList={this.state.fileList}
                    data={
                      {
                        id: this.state.uuid
                      }
                    }
                    action="/app-upload/web/v1/enhance/getPreConfig"
                    accept=".yyddesc"
                    className="upload-attach"
                    beforeUpload={ this.beforeUploadFile }
                    onChange={this.handleUploadFile}>
                    <Button colors="primary"
                            shape="squared">
                      <Icon type="uf-upload"/> 上传文件
                    </Button>
                  </Upload>
                </Col>
                <Col xs={4}>
                  <a style={{color: '#0084ff'}}
                     href="//yonyoucloud-developer-center.oss-cn-beijing.aliyuncs.com/demo.yyddesc">
                    点击下载示例描述文件
                  </a>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>应用名称</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <FormControl
                    placeholder="给应用起个名字"
                    maxLength="100"
                    value={ this.state.appName }
                    onChange={ this.handleValueChange('appName') }
                  />
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>应用编码</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <FormControl
                    placeholder="请输入数字、字母、下划线、斜线、中划线"
                    maxLength="100"
                    value={ this.state.appCode }
                    onChange={ this.handleValueChange('appCode') }
                  />
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>版本号</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <FormControl
                    placeholder="请输入版本号,例如 1.0、10.3-32bit、1.10-rc-20170301"
                    maxLength="100"
                    value={ this.state.imageVersion }
                    onChange={ this.handleValueChange('imageVersion') }
                  />
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>镜像名称</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <FormControl
                    value={ this.state.imageName }
                    onChange={ this.handleValueChange('imageName') }
                    maxLength="100"
                    placeholder="请输入数字、小写字母、下划线、斜线、中划线"
                  />
                </Col>
                <Col sm={9} smOffset={3} xs={8} xsOffset={4}>
                                <span
                                  className="upload-help">
                                    {`dockerhub.yyuap.com/${this.state.u_providerId}/${this.state.imageName}:${this.state.imageVersion}`}
</span>
                </Col>
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>应用分类</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <Select
                    value={this.state.appType}
                    onChange={this.handleSelect('appType')}>
                    <Option value="j2ee">Java Web应用</Option>
                    <Option value="nodejs">Node应用</Option>
                    <Option value="nginx">静态网站</Option>
                    <Option value="python">Python应用</Option>
                    <Option value="dubbo">Dubbo应用</Option>
                    <Option value="go">Go应用</Option>
                    <Option value="php">PHP应用</Option>
                    <Option value="j2se">Java应用</Option>
                  </Select>
                  {
                    this.state.appType === 'nodejs' ||
                    this.state.appType === 'python' ||
                    this.state.appType === 'j2se' ||
                    this.state.appType === 'go' ? (
                      <Row>
                        <Col md={6}>
                          <Label>{ this.state.appType === 'go' ? '启动文件路径' : '启动命令'}</Label>
                          <textarea
                            rows="2"
                            style={{width: '100%'}}
                            value={ this.state.cmdRun }
                            onChange={ this.handleValueChange('cmdRun') }
                          />
                        </Col>
                        <Col md={6}>
                          <Label>代理端口</Label>
                          <FormControl
                            value={this.state.exposePort}
                            onChange={this.handleValueChange('exposePort')}/>
                        </Col>
                      </Row>
                    ) : ""
                  }
                  {
                    this.state.appType === 'php' ? (
                      <Row>
                        <Col md={6}>
                          <Label>代理端口</Label>
                          <FormControl
                            value={this.state.exposePort}
                            onChange={this.handleValueChange('exposePort')}/>
                        </Col>
                      </Row>
                    ) : ""
                  }
                  {
                    this.state.appType === 'j2se' ? (
                      <span className="upload-help">当前应用会被部署到容器的/app目录下。</span>
                    ) : null
                  }

                </Col>

              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>应用上传</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <Upload
                    listType="text"
                    fileList={this.state.warList}
                    data={this.state.formData}
                    action={warUrl}
                    onRemove={ this.removeWar }
                    className="upload-attach"
                    beforeUpload={ this.beforeUploadWar }
                    onChange={this.handleUploadWar}>
                    <Button colors="primary"
                            shape="squared">
                      <Icon type="uf-upload"/> 上传应用包
                    </Button>
                  </Upload>
                  {
                    this.state.appType === 'j2ee' || this.state.appType === 'j2se' ? (
                      <span className="upload-help">*仅可上传类型为.war格式，并大小为不超过200MB的文件</span>
                    ) : (
                      <span className="upload-help">*仅可上传类型为.tar.gz或.zip格式，并大小为不超过200MB的文件</span>
                    )
                  }


                </Col>
                <Col md={9} sm={6} mdOffset={3} smOffset={2}>
                  {
                    // this.state.showProgress ? (
                    //     <div style={{ border: '1px solid #f5f5f5', padding: 10 }}>
                    //         <div style={{ display: 'inline-block', margin: 5, verticalAlign: 'top', color: '#0084ff'}}><Icon type="uf-file"></Icon>{ this.state.warName }</div>
                    //         <Icon type="uf-del" style={{ float: 'right', margin: 5, cursor: 'pointer' }} onClick={this.deleteWar}></Icon>
                    //         <div style={{ display: 'inline-block', margin: 5, verticalAlign: 'top', float: 'right', color: '#0084ff'}}>{`${this.state.totalSize}M/${this.state.loadSize}M`}</div>
                    //         <div style={{ display: 'inline-block', margin: 5,marginRight: 20, width:200, float: 'right'}}>
                    //             <ProgressBar colors="success" size="sm" now = {this.state.progress} />
                    //         </div>
                    //
                    //     </div>
                    // ) : ""
                  }

                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>上传Logo</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <div className={classnames("avatar-img", {"default": this.state.selectImg})}>
                    {
                      this.state.selectImg === 'default-png' ? "" : (
                        <Icon
                          type="uf-close"
                          style={{position: 'absolute', top: 0, left: 190, cursor: 'pointer'}}
                          onClick={ this.clearImg }
                        />
                      )
                    }

                    {
                      this.state.imagePath ? ImageIcon(this.state.imagePath, "upload-img") : ImageIcon(this.state.selectImg)
                    }

                  </div>
                  <div className="divier"/>
                  <Col md={12} style={{paddingLeft: 0, paddingRight: 0}}>
                    <Upload
                      className="vatar-uploader"
                      showUploadList={false}
                      data={this.state.formData}
                      action={imgUrl}
                      accept="image/jpeg, image/jpg, image/png"
                      beforeUpload={this.beforeUploadImg}
                      onChange={this.handleImgUploadChange}
                    >
                      <Button colors="primary"
                              bordered
                              style={{width: 120}}
                              shape="squared"
                              disabled={!!this.state.imagePath}>
                        上传图片
                      </Button>
                    </Upload>
                    <span className="upload-help" style={{marginLeft: 18}}>*仅可上传jpg/png/jpeg格式图片，并大小为不超过2MB的文件</span>
                  </Col>
                  <Col md={12} style={{marginTop: 27, paddingLeft: 0}}>
                    <Button colors="primary"
                            bordered
                            style={{width: 120}}
                            shape="squared" onClick={this.packDown}>选择默认图片</Button>
                    <span className="upload-help"
                          style={{marginLeft: 18}}>*没有合适上传图片可直接选择默认图片</span>
                    <Panel collapsible expanded={this.state.showDefaultSelect}
                           style={{borderColor: '#fff'}}>
                      <div>
                        <p>默认应用图片</p>

                        <div className="clearfix">
                          {
                            imageArray.map(function (item, index) {
                              return (<span
                                key={ index }
                                onClick={self.selectDefault(item)}
                                className={classnames('default-img', item, {select: item === self.state.selectImg})}>
                                                {
                                                  item === self.state.selectImg ? (
                                                    <span className="selected"><Icon
                                                      type="uf-correct"/></span>
                                                  ) : ""
                                                }
                                             </span>)
                            })
                          }

                        </div>
                        <p style={{marginTop: 41}}>找不到对应标志？尝试一下颜色标记吧</p>

                        <div className="clearfix">
                          {
                            colorArray.map(function (item, index) {
                              return (<span
                                key={ index }
                                style={{marginBottom: 10}}
                                onClick={self.selectDefault(item)}
                                className={classnames('default-color', item, {select: item === self.state.selectImg})}>
                                                 {
                                                   item === self.state.selectImg ? (
                                                     <span className="selected"><Icon
                                                       type="uf-correct"/></span>
                                                   ) : ""
                                                 }

                                                 </span>)
                            })
                          }
                        </div>
                        <div className="pack-up" onClick={ this.packUp }>
                          <Icon type="uf-2arrow-up"/>收起
                        </div>
                      </div>
                    </Panel>

                  </Col>

                </Col>
              </FormGroup>
            </Row>
            {
              this.state.appType === 'j2ee' ? (
                <Row>
                  <FormGroup>
                    <Col sm={9} smOffset={3} xs={8} xsOffset={4}>
                      <Checkbox
                        checked={this.state.is_root_path_access}
                        onChange={ this.handleCheckboxChange }
                        style={{height: 20, width: 20, marginTop: 5, verticalAlign: 'sub'}}
                      />
                      <Label style={{marginLeft: 10}}>是否根目录</Label>

                    </Col>
                    <Col sm={9} smOffset={3} xs={8} xsOffset={4}>
                      <span className="upload-help" style={{width: "100%"}}>如勾选即把应用访问路径设置为根目录“/”访问</span>
                      <span
                        className="upload-help">
                                        {
                                          `访问路径：http://${this.state.u_providerId}.app.yonyoucloud.com/${this.state.is_root_path_access
                                            ? this.state.warName.split('.')[0]
                                            : "" }`
                                        }
                                        </span>
                    </Col>
                  </FormGroup>
                </Row>
              ) : ""
            }
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>基础环境</Label>
                </Col>
                <Col sm={9} xs={8}>

                  <Radio.RadioGroup
                    name="Inv"
                    className="inv-radio"
                    selectedValue={this.state.selectedInv}
                    onChange={this.handleSelect('selectedInv')}>
                    <Row>
                      {
                        images[this.state.appType].map(function (item, index) {
                          return (
                            <Col lg={6} key={index}>
                              <Radio
                                colors="primary"
                                value={item.value}>
                                { item.name }
                              </Radio>
                            </Col>
                          )
                        })
                      }
                    </Row>

                  </Radio.RadioGroup>
                </Col>
              </FormGroup>
            </Row>

            {/*<Row>*/}
              {/*<FormGroup>*/}
                {/*<Col sm={3} xs={4} className="text-right">*/}
                  {/*<Label>设置构建环境</Label>*/}
                {/*</Col>*/}
                {/*<Col sm={9} xs={8}>*/}
                  {/*<div>*/}
                    {/*<Radio.RadioGroup*/}
                      {/*name="env"*/}
                      {/*selectedValue={this.state.env}*/}
                      {/*onChange={this.changeEnv}>*/}
                      {/*<Radio colors="primary" value="1">开发环境</Radio>*/}
                      {/*<Radio colors="primary" value="2">测试环境</Radio>*/}
                      {/*<Radio colors="primary" value="3">灰度环境</Radio>*/}
                      {/*<Radio colors="primary" value="4">生产环境</Radio>*/}
                    {/*</Radio.RadioGroup>*/}
                  {/*</div>*/}
                {/*</Col>*/}
              {/*</FormGroup>*/}
            {/*</Row>*/}

            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>发布应用镜像</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <Label>应用镜像是打通应用开发和业务运维之间通路的关键交互件</Label>

                  <div>
                    <Radio.RadioGroup
                      name="image"
                      selectedValue={this.state.selectedImage}
                      onChange={this.ChangeImage.bind(this)}>
                      <Radio colors="primary" value="cata">镜像仓库</Radio>
                      <Radio colors="primary" disabled value="hub">Docker Hub</Radio>
                      <Radio colors="primary" disabled value="gegisty">私有 Registy</Radio>
                    </Radio.RadioGroup>
                  </div>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>描述</Label>
                </Col>
                <Col sm={9} xs={8}>
                                <textarea
                                  rows="3"
                                  style={{width: '100%'}}
                                  value={ this.state.describes }
                                  onChange={ this.handleValueChange('describes') }
                                />
                  <span className="upload-help" style={{width: "100%"}}>描述信息请输入不多于255个字符。</span>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <Col sm={9} smOffset={3} xs={8} xsOffset={4}>
                <Button colors="danger" style={{margin: "30px 0", width: 200}} shape="squared"
                        onClick={ this.handleSubmit }>创建新应用</Button>
              </Col>

            </Row>
          </Form>
        </Col>
        <ErrorModal show={this.state.showModal} message={<div>镜像名称重复，是否覆盖？</div>} onClose={ this.handleClose }
                    onEnsure={ this.handleEnsure }/>
      </div>

  )
  }
  }

  CreateApp.contextTypes = {
    router: PropTypes.object
  };

  export default CreateApp;
