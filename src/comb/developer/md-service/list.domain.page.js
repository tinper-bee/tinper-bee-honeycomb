// publics
import { Component, PropTypes } from 'react'
import { Button, Table, } from 'tinper-bee'
import { withRouter } from 'react-router'

// self components
import withStyle from './component/withStyle.hoc'
import Header from './component/header.component'
import DashBoard from './component/board.component'
import PopupModal from './component/popupModal.component'

import { dateFormat } from './util'
import { splitParam } from '../components/util'
import MainPage from '../domain/Main';
// api
import { operation, listQ, renew, checkstatus} from '../serves/middleare'

// static
import './index.css'
import { logo, STATE, PROPS, OPT, OPT_EN, MILLISECS_IN_A_DAY, insStatusStyle } from './const'


const STORAGE_TYPE = 'domain'
const WrappedHeader = withRouter(Header);



class ListPage extends Component {
  static propTypes = {}
  static defaultProps = {}

  state = {
    clickIndex: null,
    dataSource: [],
    showModal: false,
    panelActiveKey: '1', //active key
    domain: this.props.params.id

  }
  // none state data
  __modalPayLoad = []
  __opType = ''

  // lifeCyle hooks
  componentDidMount() {
    let { params } = this.props;

  }

  /* Modal handling methods */
  manageRowOperation = rec => evt => {
    /* use simple factory now.
    * if complicated,change to use factory method
    */
    const type = evt.target.dataset.label;
    this.__opType = type;
    this.setModalPayLoad([rec]);
    this.setState({ showModal: true });
  }



  render() {
    const { style } = this.props;
    return (
      <div style={{ background: '#fff'}}>
        <WrappedHeader>
          <span>域名管理</span>
        </WrappedHeader>
        { <MainPage domain={this.state.domain} appid={this.props.params.id.split('.')[0]}  /> }
      </div>
    )
  }
}



export default withStyle(() => ({
  body: {
    padding: '20px 40px 50px 40px',

  },
  board: {
    height: '300px',
    width: 220,
    display: 'inline-block',
    marginRight: '20px',
    verticalAlign: 'top',

    manageEntry: {
      display: 'inline-block',
      height: '100%',
      marginLeft: '20px',
      verticalAlign: 'top',
    },

    manageEntryType: {
      paddingTop: '50px',
      fontSize: '20px',
      fontWeight: 'bold',
    },

    manageEntryBtn: {
      width: '100px',
      marginTop: '30px',
      color: 'white',
      borderRadius: 0,
    },
  },
  list: {
    main: {
      display: 'inline-block',
      width: 'calc(100% - 245px)',
      minWidth: '400px',
      height: '400px',
      padding: '20px',
      backgroundColor: 'white',
      overflow: 'hidden',
    },
    listBtnGroup: {
      textAlign: 'right',
    },
    listBtn: {
      borderRadius: 0,
      marginBottom: '15px',
      lineHeight: '30px',
      fontSize: '14px',
      padding: '0',
    },
    tableBtn: {
      minWidth: 0,
      border: 'none',
      padding: '0 5px',
      backgroundColor: 'transparent',
      color: '#999',
    },
  },
  Running: {
    background: ' #4caf50',
    ...insStatusStyle
  },
  Checking: {
    background: '#fe7323',
    ...insStatusStyle,
  },
  Unkown: {
    background: ' #ff8a80',
    ...insStatusStyle
  },
  Deploying: {
    background: ' #29b6f6',
    ...insStatusStyle
  },
}))(ListPage)
