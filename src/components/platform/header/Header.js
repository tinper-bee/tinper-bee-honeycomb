import React,{Component} from 'react'
import mirror, {actions, connect} from 'mirrorx'
import {Navbar,Menu,FormControl,Badge,Icon} from 'tinper-bee'
import './header.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const MenuToggle = Menu.MenuToggle;
const SideContainer = Menu.SideContainer;

const NavItem = Navbar.NavItem;
const Headers = Navbar.Header;
const Brand = Navbar.Brand;
const Nav = Navbar.Nav;

class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expanded: true,
    }

  }
  onToggle(value) {
    this.setState({expanded: value});
  }
  render(){
    let {expanded} = this.props;
    return (
      <Navbar className="header platform-header" fluid expanded={this.state.expanded} onToggle={this.onToggle.bind(this)}>
        <div className="platform-left">
          <span className="platform-left-icon">
            <i className="uf uf-userset"></i>
          </span>
        </div>

        <div className="platform-title"><span>首页</span></div>

        <div className="platform-right">
          <div className="tc platform-right-index" >
            <i className="uf uf-search-light-2"></i></div>
          <div className="tc platform-right-index" >
            <i className="uf uf-4square-3"></i></div>
          <div className="tc platform-right-index">
            <i className="uf uf-bell-o" title="智能通讯"></i>
            <span className="CircleDot"></span></div>
        </div>
      </Navbar>
    )
  }

}


export default Header

