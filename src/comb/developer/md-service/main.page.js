// publics
import { Component, PropTypes } from 'react'
import {Button, Row} from 'tinper-bee';
import { listQ } from '../serves/middleare'
import Items from './component/serivce.item'
import { describes, logo } from './const'
import Header from './component/header.component'


class MainPage extends Component {
  // props
  static propTypes = {}
  static defaultProps = {}

  state = {
    mysql: 0,
    redis: 0,
    mq: 0,
    zk: 0,
    jenkins:0,
    dclb:0
  }
  // lifeCyle hooks
  componentDidMount() {
    listQ({ size: 20, index: 0 }, 'mysql')
      .then((data) => {
         if(data['content']){
             this.setState({
              mysql: data['content'].length
            });
          }
      })
      .catch((error) => {
             console.log('操作失败');
            console.log(error.message);
            console.log(error.stack);
       });
    listQ({ size: 20, index: 0 }, 'redis')
      .then((data) => {
         if(data['content']){
             this.setState({
              redis: data['content'].length
            });
          }
      })
      .catch((error) => {
             console.log('操作失败');
            console.log(error.message);
            console.log(error.stack);
       });

    listQ({ size: 20, index: 0 }, 'mq')
      .then((data) => {
         if(data['content']){
             this.setState({
               mq: data['content'].length
            });
          }
      })
      .catch((error) => {
             console.log('操作失败');
            console.log(error.message);
            console.log(error.stack);
       });

    listQ({ size: 20, index: 0 }, 'zk')
      .then((data) => {
         if(data['content']){
             this.setState({
               zk: data['content'].length
            });
          }
      })
      .catch((error) => {
             console.log('操作失败');
            console.log(error.message);
            console.log(error.stack);
       });

    listQ({ size: 20, index: 0 }, 'jenkins')
        .then((data) => {
         if(data['content']){
             this.setState({
                jenkins: data['content'].length
            });
          }
      })
      .catch((error) => {
             console.log('操作失败');
            console.log(error.message);
            console.log(error.stack);
       });


    listQ({ size: 20, index: 0 }, 'dclb')
        .then((data) => {
            if(data['content']){
                this.setState({
                  dclb: data['content'].length
                });
              }
          })
      .catch((error) => {
            console.log('操作失败');
            console.log(error.message);
            console.log(error.stack);
       });
  }
  // methods
  gotoManageList = type => evt => {
    this.props.router.push(`/list/${type}`);
  }

  // renders
  render() {
    const { style } = this.props;
    let self = this;

    let serivceItems = describes.map((result, i) => {
      return (
        <Items
         info={result}
         count = {self.state[result.id]}
         logo={logo[result.id]}
        >
          <Button
           colors="primary"
           onClick={self.gotoManageList(result.id)}
           >管理我的{result.name}</Button>
        </Items>
      )
    })


    return (
      <Row>
        <Header widthGoBack={false}>
          <span>我的中间件服务</span>
        </Header>
        <div style={{padding: "0 0 20px 0"}} className="clearfix">
          {serivceItems}
        </div>
      </Row>
    )
  }
}

export default MainPage;
