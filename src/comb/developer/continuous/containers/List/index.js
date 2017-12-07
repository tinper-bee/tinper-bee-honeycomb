import React, {Component, cloneElement} from 'react';
import {Button, InputGroup, FormControl, Icon, Message} from 'tinper-bee';
import {Link} from 'react-router';

import Title from 'components/Title';
import UploadList from '../UploadList';
import Search from 'components/search';
import {getJenkins} from 'serves/CI';

import './index.less';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      jenkinsList: []
    }
  }

  componentDidMount() {
    getJenkins().then((res) => {
      let data = res.data;
      if (data.error_code) {
        return Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        })
      }
      let jenkinsAry = data.detailMsg.data.content;
      let jenkinsList = [];
      if (jenkinsAry instanceof Array) {
        jenkinsAry.forEach((item) => {
          jenkinsList.push({
            name: item.insName,
            key: item.pkMiddlewareJenkins,
            host: `http://${item.serviceDomain}`,
            insStatus: item.insStatus
          })
        })
      }
      this.setState({
        jenkinsList
      })
    })
  }

  /**
   * 搜索
   **/
  handleSearch = (value) => {
    this.setState({
      searchValue: value
    })
  }

  /**
   * 清空搜索
   */
  handleEmpty = () => {
    this.setState({
      searchValue: ''
    })
  }


  render() {

    return (
      <div>
        <Title showBack={false} name="持续集成"/>
        <div className="header-button">
          <Link to="/createApp" style={{color: "#fff"}}>
            <Button colors="primary" shape="squared">
              <i className="cl cl-add-c-o create-icon"/>
              创建新应用
            </Button>
          </Link>

          <div className="jenkins-list">
            {
              this.state.jenkinsList.map((item) => {
                let btn = (
                  <Button
                    disabled={item.insStatus !== 'Running'}
                    colors="primary"
                    shape="squared"
                    className="jenkins-btn"
                    bordered
                    key={ item.key }>
                    <span className="jenkins-icon"/>
                    { item.name }
                  </Button>
                );
                if (item.insStatus !== 'Running') {
                  return btn;
                }
                return (
                  <a href={ item.host } target="_blank">
                    { btn }
                  </a>
                )
              })
            }
          </div>
          <Search
            className="upload-search"
            onSearch={ this.handleSearch }
            onEmpty={ this.handleEmpty }
          />

        </div>
        <div className="applist">
          <UploadList searchValue={ this.state.searchValue }/>
        </div>
      </div>


    )
  }
}

export default List;
