import React,{Component, PropTypes} from 'react';
import {Modal,Button} from 'tinper-bee';

import './index.less';
import Loadingstate  from 'bee-loading-state';
import 'bee-loading-state/build/Loadingstate.css';

class SimpleModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
          show: false
      };
  }
  static propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    onEnsure: PropTypes.func,
    title: PropTypes.string
  }
  static defaultProps = {
    show: false,
    onClose: () => {},
    onEnsure: () => {},
    title: ''
  }

  onEnsure=()=>{
    const {onEnsure} = this.props;
    
    if(onEnsure instanceof Function){
      this.setState({show:true});
      onEnsure();
      this.setState({show:false});
    }
      
  }
  render () {
    const {title,onClose,show, onEnsure} = this.props;


    return (
      <Modal
        show = { show }
        className="simple-modal"
        onHide = { onClose } >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={ onClose } shape="squared" style={{marginRight: 50}}>取消</Button>
          <Loadingstate onClick={ this.onEnsure } colors="primary" shape="squared" show={ this.state.show } >确认</Loadingstate>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default SimpleModal;
