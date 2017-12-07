import React,{Component} from 'react';
import {Modal,Button} from 'tinper-bee';

const defaultProps = {
    buttonTitle: "确认",
    title: '提示',
    onEnsure: function () {}
}

class ErrorModal extends Component {
    constructor(props) {
        super(props);
    }
    render () {
        const {show,onClose,message,title,buttonTitle,onEnsure} = this.props;

        return (
              <Modal
              show = { show }
              backdrop = "static">
                  <Modal.Header>
                      <Modal.Title>{title}</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      {message}
                  </Modal.Body>

                  <Modal.Footer>

                      <Button onClick={ onClose } shape="squared" style={{ marginBottom: 15 }}>取消</Button>
                      <Button onClick={ onEnsure } colors="primary" shape="squared" style={{ marginLeft: 20, marginRight: 20, marginBottom: 15  }}>{buttonTitle}</Button>
                  </Modal.Footer>
             </Modal>
        )
    }
}

ErrorModal.defaultProps = defaultProps;

export default ErrorModal;
