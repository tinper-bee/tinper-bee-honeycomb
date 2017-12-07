// publics
import { Component } from 'react'
import { Button } from 'tinper-bee'

// self components
import withStyle from './component/withStyle.hoc'
import PageLoading from '../components/loading'

import { maxInsNum, listQ } from '../serves/middleare'

// static
import './index.css'
import pageImg from '../assets/img/error-pool.png'

const TIME_TO_REDIRECT = 5;

class ListPage extends Component {
  static propTypes = {}
  static defaultProps = {}

  state = {
    tick: TIME_TO_REDIRECT,
  }
  // lifeCyle hooks
  componentDidMount() {
    let { type } = this.props.location.query;
    let start = TIME_TO_REDIRECT;
    this.timer = setInterval(() => {
      start = start - 1;
      if (start < 0) {
        this.props.router.replace(`/list/${type}`);
      }
      this.setState({ tick: start })
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  // methods

  // renders

  render() {
    const { style } = this.props;
    const { loading } = this.state;
    let { limit, type } = this.props.location.query;

    if (loading) {
      return (<PageLoading show={loading} />)
    } else {
      return (
        <div style={style.main}>
          <img src={pageImg} width="160" height="160" />
          <div style={style.title}>
            目前您仅能创建
            <span style={style.higthlight}>
              {limit}
            </span>
            个实例
          </div>
          <div>{TIME_TO_REDIRECT}s 后跳转至服务列表 {this.state.tick}s</div>
          <div>
            <span
              style={style.redirect}
              onClick={(e) => {
                e.preventDefault();
                this.props.router.replace(`/list/${type}`)
              }}
            >
              现在跳转
            </span>
          </div>
        </div>
      )
    }

  }

}


export default withStyle(() => ({
  main: {
    textAlign: 'center',
    padding: '150px 50px',
    height: '100%',
    background: 'white',
  },
  title: {
    fontSize: 30,
  },
  higthlight: {
    color: 'red',
    padding: '0 5px',
  },
  redirect: {
    color: '#42a5f5',
    cursor: 'pointer',
  },
}))(ListPage)
