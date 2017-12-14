
import React,{Component} from 'react';
import {Modal,Button} from 'tinper-bee';

class DelLostRPConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  close = () => {
    this.setState({
      showModal: false
    });
  }
  onConfirm = () => {
    const {onConfirmDelete} = this.props;

    if(onConfirmDelete){
      onConfirmDelete();
    }

    this.setState({
      showModal: false
    });
  }
  open = () => {
    this.setState({
      showModal: true
    });
  }
  render () {
    const {title} = this.props;

    return (
      <span className="delete-key-modal">
          <i className="uf uf-del" onClick={ this.open } title={title}></i>
              <Modal className="mrp-add"
                     show = { this.state.showModal }
                     onHide = { this.close } >
                <Modal.Header>
                  <Modal.Title>删除</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  该主机已失联，确定要删除么？
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

export default DelLostRPConfirm;
