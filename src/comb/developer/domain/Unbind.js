import React,{Component} from 'react';
import {Modal,Button} from 'tinper-bee';

class Unbind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    close() {
        this.setState({
            showModal: false
        });
    }
    onConfirm() {
      const {onConfirmDelete} = this.props;

      if(onConfirmDelete){
        onConfirmDelete();
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
    render () {
        const {title} = this.props;

        return (
          <span className="delete-key-modal">
          <a className="delete-modal-button" onClick={ this.open }>{title}</a>
              <Modal
              show = { this.state.showModal }
              onHide = { this.close } >
                  <Modal.Header>
                      <Modal.Title>解绑</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      确定要解绑么
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

export default Unbind;
