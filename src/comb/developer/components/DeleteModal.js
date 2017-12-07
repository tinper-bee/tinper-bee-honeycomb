import React,{Component} from 'react';
import {Modal,Button} from 'tinper-bee';

class DeleteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: this.props.show
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
        const {title,show,id} = this.props;

        return (

          <span className="delete-key-modal">

              <Modal
              show = { this.state.showModal }
              backdrop = "static"
              onHide = { this.close } >
                  <Modal.Header>
                      <Modal.Title>删除Access Key</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      删除后不可恢复，您确定要删除ID为 {id} 的Access Key吗?
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

export default DeleteModal;
