import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {Modal,Button} from 'tinper-bee';

class DelRPConfirm extends Component {
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
        if(onConfirmDelete)onConfirmDelete();
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
        return (
            <span className="mrp-del">
                <i className="uf uf-del" title="删除" onClick={this.open}/>
              <Modal
                  show = { this.state.showModal }
                  onHide = { this.close } className="mrp-add">
                  <Modal.Header>
                      <Modal.Title>删除</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      您确定要删除此资源池么？
                  </Modal.Body>
                  <Modal.Footer>
                      <Button onClick={ this.close } shape="border" style={{marginRight: 50}}>取消</Button>
                      <Button onClick={ this.onConfirm } colors="primary">确认</Button>
                  </Modal.Footer>
             </Modal>
          </span>
        )
    }
}

export default DelRPConfirm;
