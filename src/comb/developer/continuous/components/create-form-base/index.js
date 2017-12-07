import {Component, PropTypes} from 'react';
import {Label, Upload, Button, Icon, FormGroup, FormControl, Panel} from 'tinper-bee';
import classnames from 'classnames';

import {ImageIcon} from 'components/ImageIcon';

import {success, err, warn} from 'components/message-util';
import {verify} from 'lib/verification';
import { guid } from 'components/util';

import {getUploadImgInfo, checkAppName} from 'serves/CI';

import {IMAGEARRAY, COLORARRAY} from '../../constant';
import './index.less';


class CreateFormBase extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    fileList: [],
    uuid: '',
    appName: '',
    appCode: '',
    imageVersion: '',
    selectImg: 'default-png',
    imagePath: null,
    showDefaultSelect: false,
    formData: {},
    describes: '',
    imageUrl: null,
    nameRepeat: false,
    useDesc: false, //是否使用描述文件
  };
  imgUrl = "";
  fileRemove = false;
  removeFile = false;


  componentDidMount() {
    let { baseData } = this.props;
    let time = new Date();
    this.setState({
      ...baseData,
      imageVersion: `${time.getFullYear()}${time.getMonth() + 1}${time.getDate()}${time.getHours()}${time.getMinutes()}${time.getSeconds()}`,
    })
  }

  /**
   * 上传描述文件之前
   * @param file
   * @param fileList
   */
  beforeUploadFile = (file, fileList) => {
    let isJPG = true, isLt2M = true;
    this.setState({
      uuid: guid()
    });
    let postFix = file.name.split('.').pop();

    if(postFix !== 'yml' && postFix !== 'yyddesc'){
      warn('请上传yml格式和yml后缀或yyddesc后缀的文件。');
      return false;
    }
    if (file.type) {

    }
  }

  /**
   * 上传 描述文件
   * @param info
   */
  handleUploadFile = (info) => {
    let { getConfigData } = this.props;

    let fileList = info.fileList;

    fileList = fileList.slice(-1);

    if (info.file.response) {

      let data = info.file.response, uploadData = {}, confData = {};
      if (data.hasOwnProperty('error_code')) {

        if(!this.removeFile){
          return err(data.error_message);
        }else{
          this.removeFile = false;
        }
      } else{
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
          });
          this.checkName({target:{value: data.appName}});
          let paramData = {
            selectedInv: uploadData.baseImage,
            imageName: uploadData.imageName,
            is_root_path_access: uploadData.is_root_path_access,
            appType: uploadData.appType
          };
          getConfigData(paramData);

        } catch (e) {
          err('您上传的描述文件格式错误，或内部错误。请审查描述文件，或手动填写。');
        }
      }
    }
    this.setState({fileList});
    this.fileRemove = false;
  }

  removeFile = () => {
    this.fileRemove = true;
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
   * 校验名称是否重复
   */
  checkName = (e) => {
    let appName = e.target.value;

    checkAppName(appName).then((res) => {
      let data = res.data;
      if(data.error_code){
        return err(data.error_message);
      }
      if(data){
        this.setState({
          nameRepeat: true
        })
      }else{
        this.setState({
          nameRepeat: false
        })
      }
    })
  }

  /**
   * 选取默认图片或图标
   * @param value 当前选取的值
   * @returns {Function}
   */
  selectDefault = (value) => () => {
    this.setState({
      selectImg: value,
      imagePath: null,
    })
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
        warn('图片格式错误!');
        return isJPG;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        warn('图片过大，请换用小于2MB的图片!');
        return isLt2M;
      }
    }

    //同步获取上传信息
    return getUploadImgInfo((res) => {
      let data = JSON.parse(res);
      let formData = this.state.formData;

      formData.key = data.perfix + '${filename}';
      formData.policy = data.policy;
      formData.OSSAccessKeyId = data.accessid;
      formData.success_action_status = '200';
      formData.callback = data.callback;
      formData.signature = data.signature;
      formData.name = file.name;
      this.imgUrl = data.host;

      this.setState({
        formData: formData,
        imgPrefix: data.perfix
      });
    });

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
        success("上传成功。");

      } else {
        err("上传失败。");
      }
    }

  }

  /**
   * 清除图片
   */
  clearImg = () => {
    this.setState({
      selectImg: "default-png",
      imagePath: null,
    })
  }

  /**
   * 回到首页
   */
  goBack = () => {
    this.context.router.push('/');
  }

  /**
   * 下一步
   */
  handleNextStep = () => {
    let {nextStep, saveInfo} = this.props;
    if(this.state.nameRepeat){
      return warn("应用名称重复，请修改。");
    }
    if (!verify(this.state.appCode, 'appCode', /^[a-zA-Z0-9/][0-9a-zA-Z\-]+[a-zA-Z0-9]$/)) {
      return warn("应用编码格式不正确，只可以输入数字、字母、中划线，且不以中划线开头。");
    }
    if (this.state.imageUrl === "" && this.state.selectImg === "") {
      return warn("请先上传图片或者选择默认图标。");
    }
    if (this.state.appName === "" || this.state.imageVersion === "") {
      return warn("参数不能为空。");
    }
    if (!verify(this.state.imageVersion, 'version')) {
      return warn("版本格式不正确。");
    }
    if (this.state.describes.length > 255) {
      return warn('描述文件最大限制为255个字符，请重新输入。');
    }

    saveInfo(this.state);
    nextStep();
  }

  /**
   * 显示上传描述文件
   */
  showDesc = () => {
    this.setState({
      useDesc: true
    })
  }

  /**
   * 移除描述文件
   */
  handleRemoveFile = () => {
    this.removeFile = true;
  }


  render() {
    return (
      <div className="create-form-base">
        {
          this.state.useDesc ? (
            <div>
              <div className="create-form-item upload-desc">
                <Label>
                  推荐使用-上传描述文件 (快速完成各属性填写)
                </Label>
                <div>
                  <Upload
                    listType="text"
                    fileList={this.state.fileList}
                    data={
                      {
                        id: this.state.uuid
                      }
                    }
                    action="/app-upload/web/v1/enhance/getPreConfig"
                    accept=".yml,.yyddesc"
                    className="upload-attach"
                    beforeUpload={ this.beforeUploadFile }
                    onRemove={this.handleRemoveFile}
                    onChange={this.handleUploadFile}>
                    <Button colors="warning"
                            shape="squared">
                      <Icon type="uf-upload"/> 上传文件
                    </Button>
                  </Upload>
                  <a
                    className="download-demo"
                    download="developer-center-app-sample"
                    href="//yonyoucloud-developer-center.oss-cn-beijing.aliyuncs.com/developer-center-app-sample.yml">
                    下载描述文件模板
                  </a>

                </div>
                <div className="desc">
                  <p>
                    *如果您没有描述文件，可以不上传
                  </p>
                  <p>
                    *描述文件内包含：应用基本信息、构建信息、配置信息，可以帮助您快速展开工作。
                  </p>
                </div>
              </div>
              <div className="divier"/>
            </div>

          ) : null
        }

        <div className="base-form-item create-form-item">
          <FormGroup>
            <Label>应用名称</Label>
            <FormControl
              placeholder="给应用起个名字"
              maxLength="100"
              onBlur={ this.checkName }
              value={ this.state.appName }
              onChange={ this.handleValueChange('appName') }
            />
          </FormGroup>
          <FormGroup>
            <Label>应用编码</Label>
            <FormControl
              placeholder="请输入数字、字母、中划线，且不以中划线开头"
              maxLength="100"
              value={ this.state.appCode }
              onChange={ this.handleValueChange('appCode') }
            />
          </FormGroup>
          <FormGroup>
            <Label>版本号</Label>
            <FormControl
              placeholder="请输入版本号,例如 1.0、10.3-32bit、1.10-rc-20170301"
              maxLength="100"
              value={ this.state.imageVersion }
              onChange={ this.handleValueChange('imageVersion') }
            />
          </FormGroup>
          <div className="robot-notice">
            <i className="cl cl-robot" />
            <div className="arrow" />
            <div className="content">
                {
                  this.state.useDesc ?
                    <p>亲，是不是很方便？保存好您的描述文件，下次可以继续用哦！</p> : (
                      <div>
                        <p>繁琐的填写好心累。。。要不要来试试一步到位的<span className="bold">描述文件上传</span>？</p>
                        <Button
                          size="sm"
                          onClick={ this.showDesc }
                          colors="danger">
                          试用
                        </Button>
                      </div>
                    )
                }

            </div>
          </div>
          {
            this.state.nameRepeat ? (
              <div className="err-message">应用名称重复，请修改。</div>
            ) : null

          }
        </div>
        <div className="divier"/>
        <div className="base-form-item create-form-item">
          <Label>应用LOGO</Label>
          <div>
            <div className={classnames("avatar-img", {"default": this.state.selectImg})}>
              {
                this.state.selectImg === 'default-png' ? null : (
                  <Icon
                    type="uf-close"
                    onClick={ this.clearImg }
                  />
                )
              }

              {
                this.state.imagePath ? ImageIcon(this.state.imagePath, "upload-img") : ImageIcon(this.state.selectImg)
              }
            </div>
            <div className="choise-img">
              <div>
                <Upload
                  className="vatar-uploader"
                  showUploadList={false}
                  data={this.state.formData}
                  action={this.imgUrl}
                  accept="image/jpeg, image/jpg, image/png"
                  beforeUpload={this.beforeUploadImg}
                  onChange={this.handleImgUploadChange}
                >
                  <Button
                    colors="primary"
                    bordered
                    shape="squared"
                    disabled={!!this.state.imagePath}>
                    上传LOGO
                  </Button>
                </Upload>
                <span className="upload-help" style={{marginLeft: 18}}>*仅可上传jpg/png/jpeg格式图片，并大小为不超过2MB的文件</span>
              </div>

              <div>
                <Button
                  colors="primary"
                  bordered
                  shape="squared" onClick={this.packDown}>
                  默认LOGO选择
                </Button>
                <span className="upload-help"
                      style={{marginLeft: 18}}>*没有合适上传图片可直接选择默认LOGO</span>
              </div>

            </div>
          </div>

          <Panel collapsible expanded={this.state.showDefaultSelect}>
            <div>
              <p>默认应用LOGO</p>

              <div className="clearfix">
                {
                  IMAGEARRAY.map((item, index) => {
                    return (
                      <span
                        key={ index }
                        onClick={this.selectDefault(item)}
                        className={classnames('default-img', item, {select: item === this.state.selectImg})}>
                        {
                          item === this.state.selectImg ? (
                            <span className="selected">
                              <Icon
                                type="uf-correct"/>
                            </span>
                          ) : null
                        }
                      </span>
                    )
                  })
                }

              </div>
              <p style={{marginTop: 41}}>找不到对应LOGO？尝试一下颜色标记吧</p>

              <div className="clearfix">
                {
                  COLORARRAY.map((item, index) => {
                    return (
                      <span
                        key={ index }
                        style={{marginBottom: 10}}
                        onClick={this.selectDefault(item)}
                        className={classnames('default-color', item, {select: item === this.state.selectImg})}>

                        {
                          item === this.state.selectImg ? (
                            <span className="selected">
                              <Icon
                                type="uf-correct"
                              />
                            </span>
                          ) : null
                        }


                      </span>
                    )
                  })
                }
              </div>
              <div className="pack-up" onClick={ this.packUp }>
                <Icon type="uf-2arrow-up"/>收起
              </div>
            </div>
          </Panel>
          <div className="desc">
            <p>
              *您可以选择自己上传或从我们的图标库中选取
            </p>
            <p>
              *应用标志将展示到应用卡片列表以方便您快速查找到相应的文件，请尽量选择与应用相关的图片。
            </p>
          </div>
        </div>
        <div className="divier"/>
        <FormGroup>

          <Label>描述</Label>

          <textarea
            rows="3"
            className="desc-text"
            value={ this.state.describes }
            onChange={ this.handleValueChange('describes') }
          />
          <div className="upload-help">描述信息请输入不多于255个字符。</div>
        </FormGroup>
        <div className="divier"/>
        <div className="btn-group">
          <Button shape="squared" colors="danger" className="next-btn" onClick={ this.handleNextStep }>下一步</Button>
          <Button shape="squared" className="cancel-btn" onClick={ this.goBack }>取消</Button>
        </div>

      </div>
    )
  }
}

export default CreateFormBase;
