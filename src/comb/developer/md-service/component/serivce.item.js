import {Component, PropTypes} from 'react'
import {Button} from 'tinper-bee';
import {Route,Link} from 'mirrorx'
import './serivceitem.css'

export default class Items extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let  {info, children , count, logo} = this.props;
    return (
      <div className="item">
        <div className="item-wrap">
          <div className="item-left" style={{backgroundColor: info.bgcolor}}>
            {
              info.isprobation ?
              (<div className="probation">试用</div>)
              :''
            }
            <img src={logo}/>
            <span className="serivce-count">{count}</span>
          </div>
          <div className="item-right">
            <div className="item-right-top">
              <span className="item-name">{info.name}服务</span>
              <Link to={info.newSerivce}>
                <Button shape="round" bordered="true" className="new-serivce">
                  创建一个
                </Button>
              </Link>
            </div>
            <div className="item-right-center">
              <p>
                {info.describe}
              </p>
            </div>
            <div className="item-right-bottom">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
