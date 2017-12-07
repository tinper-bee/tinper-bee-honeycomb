import React, {Component, PropTypes} from 'react';
import {Row, Col, Message} from 'tinper-bee';
import {UpdatePublishTime, GetNewUploadDetail, GetVersionList} from 'serves/appTile';
import Title from 'components/Title';
import PublishForm from 'components/publishForm/index';
import {formateDate, lintAppListData} from 'components/util';
import {getDescription} from 'serves/CI';

class AppPublish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      descObj: {}
    };

  }

  componentDidMount() {
    const {params, location} = this.props;
    let self = this;

    GetNewUploadDetail(params.id, (response) => {
      let newList = lintAppListData(response, null, null);

      GetVersionList(params.id, (res) => {
        let data = lintAppListData(res, null, null);
        data.forEach((item, index) => {
          if (item.version === location.query.version) {
            newList.confCenterId = item.confCenterId;
            newList.filePath = item.filePath;
            let image = newList.dockerImageName;
            let ary = image.split(':');
            ary[ary.length - 1] = location.query.version;
            image = ary.join(':');
            newList.dockerImageName = image;
            newList.cmdRun = item.cmdRun;
          }

        });
        self.setState({
          data: newList
        });
        if (newList.hasOwnProperty('descFileId')) {
          getDescription(newList.descFileId, 'PUBLISH_MODULE')
            .then((res) => {
              let data = res.data;
              if (data.error_code) {
                Message.create({
                  content: data.error_message,
                  color: 'danger',
                  duration: null
                })
              } else {
                if(data && data.hasOwnProperty('modules') && data.modules instanceof Array && data.modules.length !== 0){
                  this.setState({
                    descObj: data.modules[0].content
                  })
                }

              }
            })
        }

      })


    });


  }

  /**
   * 提交的回调函数
   * @param logId
   * @param appName
   */
  submitCallback = (logId, appName) => {

    return (response) => {
      let id = this.props.params.id;
      let data = response.data;
      if (!data.error_code) {

        this.context.router.push(`/transition/success?id=${data.id}&logId=${logId}&appName=${appName}&offset=${data.log_size}&appId=${data.app_id}`);

        UpdatePublishTime(`?appUploadId=${this.state.data.appUploadId}&publishTime=${formateDate(data.ts)}`, function (res) {
          if (res.data.error_code) {
            Message.create({content: res.data.error_message, color: 'danger', duration: null});
          }
        })
      } else {

        Message.create({content: response.data.error_message, color: 'danger', duration: null});
        if (data.error_code !== -1) {
          this.context.router.push(`/transition/failed?id=${id}`);
        }
      }
    }

  }

  render() {
    return (
      <div className="public">
        <Title name="部署应用"/>
        <Col md={12}>
          <PublishForm data={ this.state.data } configData={ this.state.descObj } onSubmit={this.submitCallback}/>
        </Col>
      </div>
    )
  }

}

AppPublish.contextTypes = {
  router: PropTypes.any
};


export default AppPublish;
