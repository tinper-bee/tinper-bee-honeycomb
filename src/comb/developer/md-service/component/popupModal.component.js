// publics
import { Component, PropTypes } from 'react'
import { Modal, Table ,Button} from 'tinper-bee'

// self components
import withStyle from './withStyle.hoc'

// static
import { STATE, PROPS, MILLISECS_IN_A_DAY } from '../const'

class PopupModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    hideModal: PropTypes.func,
    serviceType: PropTypes.string.isRequired,
    operation: PropTypes.func,
    optType: PropTypes.string,
    payLoad:PropTypes.array,
  }

  static defaultProps = {
    show: false,
    hideModal: () => { },
    serviceType: '',
    operation: () => { },
    optType: '',
    apyLoad: [],
  }

  // renders
  renderTalbeColumns = () => {
    const { serviceType } = this.props;

    const columns = [{
      title: '名称',
      dataIndex: PROPS[serviceType]['insName'],
      key: PROPS[serviceType]['insName'],
    }, {
      title: '运行状态',
      dataIndex: 'insStatus',
      key: 'insStatus',
      render: (text) => {
        return STATE[STATE[text]];
      },
    }, {
      title: '规格(MB)',
      dataIndex: 'memory',
      key: 'memory',
    }, {
      title: '剩余时间',
      dataIndex: 'deathtime',
      key: 'deathTime',
      render: (text) => {
        const time = parseInt(text);
        const now = Date.now();
        const left = (time - now) / MILLISECS_IN_A_DAY;
        const day = parseInt(left);
        const hour = parseInt((left - day) * 24);

        return `${day}天${hour} 小时`;
      }
    }];

    return columns;
  }

  render() {
    const { show, hideModal, operation, payLoad, optType ,style} = this.props;

    return (
      <Modal
        show={show}
        onHide={hideModal}
        optType={optType}
        payLoad={payLoad}
      >
        <Modal.Header>
          <span style={{letterSpacing: 2}}>
            确定对存储实例做
            <span style={{ color: 'red', padding: '5px 5px' }}>{optType}</span>
            操作吗？
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
            <Table
              style={{ textAlign: "center" }}
              data={payLoad}
              columns={this.renderTalbeColumns()}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={operation} style={style.btn}>确定</Button>
          <Button onClick={hideModal}>取消</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}


export default withStyle(() => ({
  btn:{
    marginRight: 10,
  }
}))(PopupModal)
