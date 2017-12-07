import React,{Component, PropTypes} from 'react';
import {Modal,Button} from 'tinper-bee';
import Timeline from 'bee-timeline';
import { getTimeLine } from 'serves/CI';
import { err, success } from 'components/message-util';

import 'bee-timeline/build/Timeline.css';

function checkEmpty(data) {
  if(data === null)
    return '暂无数据';
  return data;
}

class TimeLineModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
  }
  static defaultProps = {
    show: false,
    onClose: () => {},

  }
  state = {
    dataAry: []
  }

  componentWillReceiveProps(nextProps) {
    let { data, show } = nextProps;

    if(show){
      getTimeLine(`?appUploadId=${data.appUploadId}&logId=${data.id}`)
        .then((res) => {
          let data = res.data;
          if(data.error_code){
            return err(`${data.error_code}:${data.error_message}`)
          }
          let dataAry = [];
          if(data.gitOperationTime){
            dataAry = [
              `获取源代码: ${checkEmpty(data.gitOperationTime)}`,
              `源代码构建: ${checkEmpty(data.mvnOperationTime)}`,
              `生成表单: ${checkEmpty(data.formSubmitTime)}`,
              `构造镜像: ${checkEmpty(data.buildImageTime)}`,
              `同步镜像仓库: ${checkEmpty(data.uploadImageRegistryTime)}`
            ]
          } else {
            dataAry = [
              `生成表单: ${checkEmpty(data.formSubmitTime)}`,
              `构造镜像: ${checkEmpty(data.buildImageTime)}`,
              `同步镜像仓库: ${checkEmpty(data.uploadImageRegistryTime)}`
            ]
          }
          this.setState({
            dataAry
          })
        });
    }

  }

  render () {
    const {onClose,show} = this.props;
    let { dataAry } = this.state;


    return (
      <Modal
        show = { show }
        className="simple-modal"
        onHide = { onClose } >
        <Modal.Header>
          <Modal.Title>版本构建时间</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Timeline>
            {
              dataAry.map((item, index) =>
                <Timeline.Item key={ index }>{item}</Timeline.Item>
              )
            }
          </Timeline>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={ onClose } shape="squared">关闭</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default TimeLineModal;
