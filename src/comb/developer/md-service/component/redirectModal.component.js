// publics
import { Component, PropTypes } from 'react'
import { Modal, Table ,Button} from 'tinper-bee'

// self components
import withStyle from './withStyle.hoc'

// static
import { STATE, PROPS, MILLISECS_IN_A_DAY } from '../const'

class RedirectModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    hideModal: PropTypes.func

  }

  static defaultProps = {
    show: false,
    hideModal: () => { }
  
   
  }

 

  render() {
    const { show, hideModal,style} = this.props;

    return (
      <Modal
        show={show}
        onHide={hideModal}
      >
        <Modal.Header>
          <span style={{letterSpacing: 2}}>
          ww
            <span style={{ color: 'red', padding: '5px 5px' }}>ww</span>
           ww
          </span>
          <span className="cl cl-bigclose-o"
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={hideModal}
          />
        </Modal.Header>

        <Modal.Body>
          <div>
            <div>
              { /*额外复杂的提示*/}
            </div>
            
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={} style={style.btn}>确定</Button>
          <Button onClick={}>取消</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}


export default withStyle(() => ({
  btn:{
    marginRight: 10,
  }
}))(RedirectModal)
