import {Component, PropTypes} from 'react';
import {
  Modal,
  Button,
  Form,
  FormGroup,
  Label,
  FormControl,
  Select,
  InputGroup,
  Upload,
  Icon
} from 'tinper-bee';

import {err, warn} from 'components/message-util';

import {getBranchList, getSshBranchList} from 'serves/CI';

import { convertToFormData } from 'lib/utils';

import {changeGitUrl} from '../../utils';

import './index.less';

const Option = Select.Option;

class GitEntityModal extends Component {
  static propTypes = {
    onEnsure: PropTypes.func,
    onClose: PropTypes.func,
    show: PropTypes.bool
  };
  static defaultProps = {
    onEnsure: () => {
    },
    onClose: () => {
    },
    show: false
  };

  state = {
    url: '',
    name: '',
    password: '',
    branch: '',
    checked: false,
    branchList: [],
    showErr: false,
    errMsg: '',
    protocol: 'http',
    fileList: []
  };
  idRsaPath = '';

  handleSSHSelect = (value) => {
    this.setState({
      protocol: value
    })
  }

  /**
   * 捕获输入框输入事件
   * @param state
   */
  handleInputChange = (state) => (e) => {
    this.setState({
      [state]: e.target.value,
      checked: false
    })
  }

  /**
   * 确认事件
   */
  handleEnsure = () => {
    let {url, name, password, branch, protocol} = this.state;
    if (!/http|git@/.test(url) || url === '') {
      return warn('请填写完整正确的URL地址');
    }
    let data = {
      url: `${url}::${branch}`,
      name: name,
      password: password,
      ssh_flag: protocol === 'ssh',
      idRsaPath: this.idRsaPath
    };
    let {onEnsure, onClose} = this.props;
    onEnsure(data);
    onClose();
  }

  /**
   * 校验可用
   *
   */
  handleCheck = () => {
    let {url, name, password, protocol, fileList} = this.state;
    if(!url){
      return this.showErr('请填写git仓库地址。');
    }
    if(protocol === 'http'){
      if(!name){
        return this.showErr('请填写git仓库登录名。');
      }
      if(!password){
        return this.showErr('请填写git仓库密码。');
      }

      getBranchList(`?gitUrl=${url}&gitUserName=${encodeURIComponent(name)}&gitPassWord=${encodeURIComponent(password)}`)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            return this.showErr(data.error_message);
          }
          this.setState({
            branchList: data,
            branch: data[0],
            checked: true,
            showErr: false
          })
        })
    } else {
      if(fileList.length === 0){
        return this.showErr('请先上传私钥');
      }
      getSshBranchList(url,convertToFormData({'file': fileList[0]}))
        .then((res) => {
          let data = res.data;
          if(data.error_code){
            return this.showErr(`${data.error_message}`)
          }
          this.setState({
            branchList: data.branckes,
            branch: data.branckes[0],
            checked: true,
            showErr: false,
          });
          this.idRsaPath = data.idRsaPath;
        })
    }

  }

  /**
   * 展示错误
   * @param msg
   */
  showErr = (msg) => {
    this.setState({
      showErr: true,
      errMsg: msg
    })
  }

  /**
   * 分支选择
   * @param value
   */
  handleSelect = (value) => {
    this.setState({
      branch: value
    })
  }


  /**
   * 上传之前的钩子函数
   * @param file
   * @param fileList
   * @returns {boolean}
   */
  beforeUpload = (file, fileList) => {

    fileList =  fileList.slice(-1);
    this.setState({
      fileList
    });

    return false;
  }

  /**
   * 清空
   */
  remove = () => {
    this.setState({
      fileList: []
    })
  }


  render() {
    let {show, onClose} = this.props;

    return (
      <Modal
        show={ show }
        onHide={ onClose }>
        <Modal.Header>
          <Modal.Title>输入Git信息</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="git-entity-form">
            <FormGroup>
              <Label>
                <span style={{color: "red"}}>*</span>
                源码库地址（支持GitLab | GitHub）
              </Label>
              <InputGroup>
                <InputGroup.Button shape="border">
                  <Select
                    defaultValue="http"
                    className="protocol-select"
                    dropdownClassName="protocol-select-dropdown"
                    dropdownStyle={{ zIndex: '5000' }}
                    value={ this.state.protocol}
                    onChange={this.handleSSHSelect}>
                    <Option value="http">http</Option>
                    <Option value="ssh">ssh</Option>
                  </Select>
                </InputGroup.Button>
                <FormControl
                  value={ this.state.url }
                  onChange={ this.handleInputChange('url') }
                />
              </InputGroup>

              <span className="upload-helper">只支持基于http/https协议的代码仓库。</span>
            </FormGroup>
            {
              this.state.protocol === 'ssh' ? (
                <FormGroup>
                  <Upload
                    listType="text"
                    fileList={this.state.fileList}
                    onRemove={ this.remove }
                    className="upload-attach"
                    beforeUpload={ this.beforeUpload }
                    >
                    <Button
                      colors="primary"
                      shape="squared">
                      <Icon type="uf-upload"/> 上传私钥
                    </Button>
                  </Upload>
                </FormGroup>
              ) : (
                <div>
                  <FormGroup>
                    <Label>登录用户名</Label>
                    <FormControl
                      value={ this.state.name }
                      onChange={ this.handleInputChange('name') }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>密码</Label>
                    <FormControl
                      type="password"
                      value={ this.state.password }
                      onChange={ this.handleInputChange('password') }
                    />
                  </FormGroup>
                </div>
                )

            }

            {
              this.state.checked ? (
                <FormGroup>
                  <Label>分支</Label>
                  <Select
                    value={ this.state.branch }
                    onSelect={ this.handleSelect }
                    dropdownStyle={{ zIndex: '5000' }}
                  >
                    {
                      this.state.branchList.map((item, index) => {
                        return <Option key={index} value={item}>
                          { item }
                        </Option>
                      })
                    }
                  </Select>
                </FormGroup>
              ) : null
            }
            {
              this.state.showErr ? (
                <span style={{color: 'red'}}>{ this.state.errMsg }</span>
              ) : null
            }

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={ onClose }
            shape="squared"
            style={{marginBottom: 15}}>
            取消
          </Button>
          {
            this.state.checked ? (
              <Button
                onClick={ this.handleEnsure }
                colors="primary"
                shape="squared"
                style={{marginLeft: 20, marginRight: 20, marginBottom: 15}}>
                确认
              </Button>
            ) : (
              <Button
                onClick={ this.handleCheck }
                shape="squared" colors="danger"
                style={{marginLeft: 20, marginRight: 20, marginBottom: 15}}>
                校验
              </Button>
            )
          }

        </Modal.Footer>
      </Modal>
    )
  }
}

export default GitEntityModal;
