import React, {Component, PropTypes} from 'react';
import {Modal, Loading} from 'tinper-bee';
import styles from './index.css';

const propTypes = {
  show: PropTypes.bool
}

const defaultProps = {
  show: false,
  container: document.body,
  loadingType: 'line'
}

class PageLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      show: false,
    }
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
      this.setState({
        show: true,
      })
    } else {
      this.timer = setTimeout(() => {
        this.setState({show: false});
      }, 300)

    }
  }

  render() {

    let modalContentStyle = {
      border: "none",
      boxShadow: "none",
      background: "transparent",
      textAlign: "center"
    };

    let modalDialogStyle = ' u-modal-diaload ';

    let {container,loadingType} = this.props;

    return (
      <Modal
        backdrop="static"
        show={this.state.show}
        contentStyle={modalContentStyle}
        dialogTransitionTimeout={1000}
        container={ container }
        backdropTransitionTimeout={1000}
        dialogClassName={modalDialogStyle}>
        <Modal.Header >
        </Modal.Header >
        <Modal.Body >
          <Loading loadingType={loadingType}/>
        </Modal.Body >
      </Modal>
    )
  }
}

PageLoading.propTypes = propTypes;
PageLoading.defaultProps = defaultProps;

export default PageLoading;
