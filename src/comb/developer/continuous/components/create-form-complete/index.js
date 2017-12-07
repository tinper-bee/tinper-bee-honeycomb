import {PureComponent, PropTypes} from 'react';
import {Button} from 'tinper-bee';

import './index.less';

class CreateFormComplete extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  handleClick = () => {
    let {appUploadId, isJump} = this.props;

    if(isJump){
      window.location.href=`/fe/appManager/index.html#/miro-detail/${appUploadId}`;
    }else{
      this.context.router.push(`/upload_detail/${appUploadId}`);
    }

  }

  render() {
    let { message, state, goBack} = this.props;
    switch (state) {
      case 'err':
        return (
          <div className="create-form-complete">
            <div className={`img ${state}`}/>
            <p>创建发生错误：<span className="error">{message}</span></p>
            <Button shape="squared" colors="primary" onClick={ goBack(0) }>
              重新创建应用
            </Button>
          </div>
        )
        break;
      case 'success':
        return (
          <div className="create-form-complete">
            <div className={`img ${state}`} />
            <p>应用创建完成，快去查看吧！</p>
            <Button shape="squared" colors="primary" onClick={ this.handleClick }>
              查看应用
            </Button>
          </div>
        )
        break;
      default:
        return (
          <div className="create-form-complete">
            <div className={`img ${state}`} />
            <p>应用正在构建中，请您稍等...</p>
          </div>
        )
    }

  }
}

export default CreateFormComplete;
