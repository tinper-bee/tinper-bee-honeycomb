import React,{Component} from 'react'
import mirror, {actions, connect} from 'mirrorx'
import {Navbar,Menu,FormControl,Badge,Icon} from 'tinper-bee'
import './Tile.css';


class Tile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    }

  }
  render(){
    const  {tiles} = this.props;
    console.log(tiles)

    let list = [];

    tiles.map((child, i)=>{
      let widgets = [];

      child.children.map((childs,t)=>{
        widgets.push(
          <li className="widget-item">
            <span className="widget-name">{childs.widgetName}</span>
            <img src={childs.icon} className=""/>
          </li>
        )
      })

      list.push(
        <dl className="widget-list">
          <dt>{child.widgetName}</dt>
          <dd>
             <ul>{widgets}</ul>
          </dd>
        </dl>
      )
    })


    return (
      <div>
        {list}
      </div>
    )
  }

}


export default Tile