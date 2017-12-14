import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {Modal,Button,Switch} from 'tinper-bee';

class DeleteConfirm extends Component {
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
        const {onConfirmDelete,fresh} = this.props;
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
            <span className="delete-key-modal">
                <span className="switch">
                    <span className="delete-key-modal">
                        <div>
                            <span
                                onClick={this.props.disabled?'':this.open}
                                className={classnames({'u-switch':true,'is-checked':this.props.checked})}
                                tabIndex="0">
                                <span className="u-switch-inner"> </span>
                            </span>
                        </div>
                    </span>
                </span>
              <Modal
                  show = { this.state.showModal }
                  onHide = { this.close } className="mrp-add">
                  <Modal.Header>
                      <Modal.Title>更改默认设置</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      您确定要更改默认资源池设置么？
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

export default DeleteConfirm;
