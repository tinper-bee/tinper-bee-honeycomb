import  PageLoading   from '../../components/loading'
import { Component, PropTypes } from 'react'

export default class PageLoad extends Component {

  static propTypes = {
    show: PropTypes.bool,
    delay:PropTypes.number,
  }

  static defaultProps = {
    show: false,
    delay: 100,
  }

  state = {
    show:false,
  }
  componentDidMount() {
    this.delayLoading(this.props);
  }
  componentWillReceiveProps(np) {
    this.delayLoading(np);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }


  delayLoading = (props) => {
    if (props.show) {
      this.timer = setTimeout(() => {
        this.setState({
          show: true,
        })
      }, props.delay);
    } else {
      this.timer && clearTimeout(this.timer);
      this.setState({ show: false });
    }
  }

  render() {
    return (
      <PageLoading show={this.state.show}></PageLoading>
    )
  }

}