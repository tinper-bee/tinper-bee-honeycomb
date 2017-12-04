import React,{Component} from 'react'
import {Link} from 'mirrorx'
import {Navbar,Menu,FormControl,Badge,Icon} from 'tinper-bee'
import './header.css'

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
      expanded: false,
    }

  }
  onToggle(value) {
    this.setState({expanded: value});
  }
  render(){
    return (
      <Navbar className="header" fluid expanded={this.state.expanded} onToggle={this.onToggle.bind(this)}>
        <MenuToggle show/>
        <Headers>
          <Brand>
            <a href="#"><img style={{width:140}} src="http://design.yyuap.com/logos/logox.png"/></a>
          </Brand>
        </Headers>

        <Nav pullRight>
          <NavItem eventKey={1}><FormControl type="search" placeholder="Search"/></NavItem>
          <NavItem eventKey={2}><Badge dataBadge="4" colors="warning"><Icon
            type="uf-bell"></Icon></Badge></NavItem>
          <NavItem eventKey={3}><Icon type="uf-bubble-o"></Icon></NavItem>
          <Menu mode="horizontal" className="dropdown">
            <SubMenu title={<span>刘认华<Icon type="uf-triangle-down"></Icon></span>}>
              <Menu.Item key="setting:1">选项 1</Menu.Item>
              <Menu.Item key="setting:2">选项 2</Menu.Item>
              <Menu.Item key="setting:3">选项 3</Menu.Item>
              <Menu.Item key="setting:4">选项 4</Menu.Item>
            </SubMenu>
          </Menu>
        </Nav>
      </Navbar>
    )
  }

}


export default Header
