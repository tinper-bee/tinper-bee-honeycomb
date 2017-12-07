import React,{Component} from 'react';
import {Modal, Button } from 'tinper-bee';

class CreateKeyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
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
    render () {
        const {title} = this.props;

        return (
          <span>
              <a className="reuse-modal-button" onClick={ this.open }>{title}</a>
              <Modal
              show = { this.state.showModal  }
              backdrop = "static"
              onHide = { this.close } >
                  <Modal.Header>
                      <Modal.Title>启用</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      刷新数据？
                  </Modal.Body>

                  <Modal.Footer>
                      <Button onClick={ this.close } shape="border" style={{marginRight: 50}}>关闭</Button>
                      <Button onClick={ this.close } colors="primary">确认</Button>
                  </Modal.Footer>
             </Modal>
          </span>
        )
    }
}

export default CreateKeyModal;
