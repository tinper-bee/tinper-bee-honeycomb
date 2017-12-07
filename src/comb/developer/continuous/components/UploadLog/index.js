import React, {
  Component
} from 'react';
import {
  findDOMNode
} from 'react-dom';
import {
  Button,
  Col,
  InputGroup,
  FormControl,
  Message,
  Popover
} from 'tinper-bee';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';

import {
  getUploadLog,
  getUploadConsole
} from 'serves/CI';
import {
  err,
  success
} from 'components/message-util';
import './index.css';


class UploadLog extends Component {
  constructor(props, content) {
    super(props, content);
    this.state = {
      consoleData: [],
      showPauseFlag: false,
      formatConsoleData: [],
      cleanData: [],
      keyStep: -1
    }
    this.timer = null;
    this.destory = false;
  }

  componentDidMount() {

    let {
      isDone,
      data,
      error_app
    } = this.props;
    if (data.hasOwnProperty('appUploadId' && data.status !== 'Create App')) {

      if (isDone || error_app) {
        this.getUploadConsoleFromDb(data.appUploadId, data.buildVersion);
      } else {
        this.getUploadConsoleFromDb(data.appUploadId, data.buildVersion).then(() => {

          this.getUploadConsole(data.appUploadId, data.buildVersion, true);
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let {
      isDone,
      data,
      error_app
    } = nextProps;
    let flag = true;
    let clear = false;

    if (data.hasOwnProperty('appUploadId') && data.status !== 'Create App') {

      if (data.buildVersion !== this.props.data.buildVersion) {
        clearTimeout(this.timer);


        this.setState({
          consoleData: [],
          formatConsoleData: [],
          cleanData: [],
        });
        flag = false;
        clear = true;
      }

      clearTimeout(this.timer);
      if (isDone || error_app) {

        this.getUploadConsoleFromDb(data.appUploadId, data.buildVersion);
      } else {
        this.getUploadConsoleFromDb(data.appUploadId, data.buildVersion).then(() => {

          this.getUploadConsole(data.appUploadId, data.buildVersion, flag, clear);
        });
      }
    }
  }

  componentWillUnmount() {
    this.destory = true;
    clearTimeout(this.timer);
  }

  /**
   * 渲染popover的版本按钮
   * @returns {XML}
   */
  renderPopBuildVersion = () => {
    let {
      renderVersion
    } = this.props;
    return (
      <Popover id="popover-version" title="版本列表">
        { renderVersion() }
      </Popover>
    )
  }

  /**
   * 从信息流中获取上传日志信息
   * @param appUploadId
   * @param buildVersion
   * @param empty 是否清空之前的log数据
   * @param clear
   */
  getUploadConsole = (appUploadId, buildVersion, empty, clear) => {
    this.setState({
      showPauseFlag: true
    });

    // this.getConsole(appUploadId, buildVersion, empty, clear);
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.getConsole(appUploadId, buildVersion, empty, clear);
      }, 100)
    }

  }

  /**
   *
   * @param appUploadId
   * @param buildVersion
   * @param empty 是否清空之前的log数据
   * @param clear
   
   */
  getConsole = (appUploadId, buildVersion, empty = false, clear = false) => {
    let param = {
      appUploadId: appUploadId,
      buildVersion: buildVersion
    };

    if (this.props.error_app)
      return;

    return getUploadConsole(param)
      .then((response) => {
        let res = response.data;
        if (res.error_code) {
          err(res.error_message);
        } else {
          let data = [];
          let oldData = this.state.consoleData;
          let formatConsoleData = '';
          if (!empty) {
            formatConsoleData = this.state.formatConsoleData;
          } else {
            if (clear) {
              formatConsoleData = [];
            } else {
              formatConsoleData = oldData;
            }

          }

          try {
            res = JSON.parse(res);
            if (res && res.length) {
              for (let i in res) {
                formatConsoleData += `${res[i]}<br/>`;
              }
            }

            // data = oldData.concat(JSON.parse(res));
          } catch (e) {
            console.log(e)
            data = oldData;
          }


          this.setState({
            consoleData: data,
            formatConsoleData,
            cleanData: data,
          })
          if (this.refs && this.refs.view) {
            this.refs.view.scrollTop = this.refs.view.scrollHeight;
          }

          if (!this.props.isDone && !this.destory && !this.props.error_app) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.getConsole(appUploadId, buildVersion);
            }, 1000)
          }

        }

      })
      .catch((e) => {
        clearTimeout(this.timer);
      })
  }

  /**
   * 从数据库获取日志信息，上穿完成后
   * @param appUploadId
   * @param buildVersion
   */
  getUploadConsoleFromDb = (appUploadId, buildVersion) => {
    this.setState({
      showPauseFlag: false
    });

    let param = {
      appUploadId: appUploadId,
      buildVersion: buildVersion
    };

    return getUploadLog(param).then((res) => {
      if (!res.data.error_code) {
        let data = [];
        try {
          data = JSON.parse(res.data);
        } catch (e) {
          console.log(e)
        }

        data = this.addN(data);
        this.setState({
          consoleData: data,
          cleanData: data,
        })
      } else {
        err(res.data.error_message);
      }
    })
  }

  addN = (data) => {
    if (!data) return;
    if (!data.length) return;
    let formatConsoleData = '';
    for (let i in data) {
      formatConsoleData += `${data[i]}<br/>`;
    }

    this.setState({
      formatConsoleData
    })
    if (this.refs && this.refs.view) {
      this.refs.view.scrollTop = this.refs.view.scrollHeight;
    }
    return formatConsoleData;
  }

  /**
   * 搜索关键
   */
  searchKey = () => {
    let {
      formatConsoleData,
      cleanData
    } = this.state;
    let keyWord = findDOMNode(this.refs.searchValue).value;
    let node = findDOMNode(this.refs.view);
    let self = this;
    if (node != "" && keyWord != "") {
      let pattern = new RegExp(keyWord, "gi");
      formatConsoleData = cleanData.replace(pattern, "<font color='keyWordColr'>" + keyWord + "</font>");
      this.setState({
        formatConsoleData
      });
    }
    let patternFont = new RegExp('<font', "gi");
    this.setState({
      keyStep: -1
    });

    if (keyWord == "") {
      this.setState({
        formatConsoleData: cleanData
      });
      this.setState({
        consoleData: cleanData
      });
    }


  }

  /**
   * 跳转搜索日志下一个
   * @param num
   */
  nextKey = (num) => {
    let self = this;
    return () => {
      let currentStep;
      let highLightTexts = document.getElementsByTagName('font')
        //let highLightTexts = self.refs.highLight;
      if (!highLightTexts || !highLightTexts.length) return;
      let len = highLightTexts.length;
      if (self.state.keyStep + num < 0) {
        currentStep = 0;
      } else if (self.state.keyStep + num >= len) {
        currentStep = len - 1;
      } else {
        currentStep = self.state.keyStep + num;
      }

      self.setState({
        keyStep: currentStep
      });
      let nexthighLight = document.getElementsByClassName('nextHighLight');
      if (nexthighLight.length) {
        nexthighLight[0].className = '';
      };
      //self.refs.view.scrollTop = 14;
      // if(highLightTexts[currentStep].offsetTop >= self.refs.view.offsetHeight) {
      //     self.refs.view.scrollTop = self.refs.view.offsetHeight - 4;
      // }else {
      //     self.refs.view.scrollTop = 0;
      // }
      self.refs.view.scrollTop = highLightTexts[currentStep].offsetTop - 50;

      highLightTexts[currentStep].className = 'nextHighLight';
    }


  }

  /**
   * 暂停或者启动console轮询
   */
  pauseConsole = () => {
    let data = this.props.data;
    if (!this.state.togglePauseFlag) {
      console.log('this.timer---' + this.timer);
      clearTimeout(this.timer);
      delete this.timer;

    } else {
      this.getConsole(data.appUploadId, data.buildVersion);
    }
    this.setState({
      togglePauseFlag: !this.state.togglePauseFlag
    })
  }


  render() {
    return (
      <Col md={12} className="upload-log">
        <Col md={12} className="log-content">
          <div ref="view" className="outer">
            <p dangerouslySetInnerHTML={{__html: this.state.formatConsoleData}}/>
          </div>
          <div className="console-edit">
            {
              this.state.showPauseFlag &&
              (
                <Button className="edit-icon" size="sm" onClick={this.pauseConsole} >
                  {
                    this.state.togglePauseFlag ?
                      (
                        <span>
                                                <i className="cl cl-play-o"/>滚动
                                            </span>
                      ) : (
                      <span>
                                                <i className="cl cl-suspend"/>暂停
                                            </span>
                    )
                  }
                </Button>
              )
            }

            <OverlayTrigger
              trigger="click"
              rootClose
              placement="top"
              overlay={this.renderPopBuildVersion()}>
              <Button
                className="edit-icon"
                size="sm">
                <i className="cl cl-find"/>
                版本
              </Button>
            </OverlayTrigger>

            <InputGroup style={{width: 400}}>
              <FormControl
                className="search-key"
                placeholder="搜索关键字"
                ref="searchValue"
                style={{borderRadius: 0, fontSize: 12, width: 200}}
                onChange={this.searchKey}
              />
              <Button
                className="edit-icon"
                style={{marginTop: -3}}
                onClick={this.nextKey(-1)}>
                上一个
              </Button>
              <Button
                className="edit-icon"
                style={{marginTop: -3}}
                onClick={this.nextKey(1)}>
                下一个
              </Button>
            </InputGroup>
          </div>
        </Col>
      </Col>
    )
  }
}

export default UploadLog;