import React,{Component} from 'react';
import {Modal,Button,Col,Row} from 'tinper-bee';
import {getImageInfoByName} from '../serves/appTile';
import {splitParam,lintAppListData,formateDate} from './util';

function checkEmpty(data) {
    if (typeof data === undefined || !data || data === "") {
        return "暂无数据";
    }
    return data;
}

class ImageDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: this.props.show,
            data:{},
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    componentDidMount () {
         const self = this;
         const {imageName} = this.props;

         getImageInfoByName(imageName, function (res) {
             let data = lintAppListData(res,null,null);
             if(!data.error_code){
                 if(data.data instanceof Array && data.data.length !== 0){
                     self.setState({
                         data: data.data[0]
                     })
                 }
             }
         });
    }

    componentWillReceiveProps(){
        var self = this;
        setTimeout(()=>{
          self.setState({showModal:self.props.show});
        });

    }
    confirm() {
      const {onConfirmShowKey} = this.props;

      if(onConfirmShowKey){
        onConfirmShowKey();
      }
        this.setState({
            showModal: false
        });
    }
    open() {
        this.setState({
            showModal: true
        });
    }
    close() {
      const {onCancelCallBack} = this.props;
      if(onCancelCallBack){
        onCancelCallBack();
      }
        this.setState({
            showModal: false
        });

    }

    render () {
        const {title,content,show} = this.props;

        let data = this.state.data;
        //<Col sm={10} smOffset={1} className="info">
        //</Col>
        return (
          <div>
              <Modal
              show = { this.state.showModal }
              onHide = { this.close } size="lg">
                  <Modal.Header>
                      <Modal.Title>镜像信息</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                            <div>
                            <Col sm={12}>
                                <div className="version-info-label">创建者:</div>
                                <div className="version-text">{checkEmpty(data.author)}</div>
                            </Col>
                            <Col sm={12}>
                                <div className="version-info-label">创建时间:</div>
                                <div className="version-text">{formateDate(data.creationtime)}</div>
                            </Col>
                            <Col sm={12}>
                                  <div className="version-info-label">Docker版本:</div>
                                  <div className="version-text">{checkEmpty(data.docker_version)}</div>
                            </Col>
                            <Col sm={12}>
                                  <div className="version-info-label">系统:</div>
                                  <div className="version-text">{checkEmpty(data.system_infomation)}</div>
                            </Col>
                            <Col sm={12}>
                                  <div className="version-info-label">镜像ID:</div>
                                  <div className="version-text">{checkEmpty(data.image_id)}</div>
                            </Col>
                            <Col md={12}>
                                  <div className="version-info-label">父镜像ID:</div>
                                  <div className="version-text">{checkEmpty(data.parent_image_id)}</div>
                            </Col>
                            </div>
                  </Modal.Body>

                  <Modal.Footer>
                      <Button onClick={ this.close }>关闭</Button>
                  </Modal.Footer>
             </Modal>
          </div>
        )
    }
}

export default ImageDetailModal;
