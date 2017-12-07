import React,{Component} from 'react';
import {Modal,Button} from 'tinper-bee';

class ForbidModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.show
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }
    componentWillReceiveProps(props){
        var self = this;
        setTimeout(()=>{
          self.setState({showModal:props.show});
        });

    }
    close() {
        this.setState({
            showModal: false
        });
    }
    open() {
        this.setState({
            showModal: true
        });
    }
    onConfirm() {
      const {onConfirmForbid} = this.props;

      if(onConfirmForbid){
         onConfirmForbid();
      }

      this.setState({
          showModal: false
      });
    }
    render () {
        const {title,show,id} = this.props;

        return (
          <span className="forbid-key-modal">

              <Modal
              show = { this.state.showModal }
              backdrop = "static"
              onHide = { this.close } >
                  <Modal.Header>
                      <Modal.Title>禁用Access Key</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                  禁用后使用ID为 {id} 的Access Key调用的服务都将失败,您确定要禁用吗?
                  </Modal.Body>

                  <Modal.Footer>
                      <Button onClick={ this.close } shape="border" style={{marginRight: 50}}>关闭</Button>
                      <Button onClick={ this.onConfirm } colors="primary">确认</Button>
                  </Modal.Footer>
             </Modal>
          </span>
        )
    }
}

export default ForbidModal;
