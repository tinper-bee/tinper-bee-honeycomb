import React,{Component} from 'react'
import mirror, {actions, connect} from 'mirrorx'
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
      expanded: true,
    }

  }
  onToggle(value) {
    this.setState({expanded: value});
  }
  render(){
    let {expanded} = this.props;
    return (
      <Navbar className="header" fluid expanded={this.state.expanded} onToggle={this.onToggle.bind(this)}>
        <MenuToggle show/>
        <Headers>
          <Brand>
            <a href="javascript:;" onClick={() => actions.sidebar.setExpanded()}>
              <i className="navmenu uf uf-navmenu"></i>
            </a>
          </Brand>
        </Headers>

        <Nav pullRight>
          <NavItem eventKey={1}>
            <FormControl type="search" placeholder="站内搜索"/>
          </NavItem>
          <NavItem eventKey={2}>
            <Badge dataBadge="4" colors="warning">
              <Icon type="uf-bell"></Icon>
            </Badge>
          </NavItem>
          <NavItem eventKey={3}><Icon type="uf-bubble-o"></Icon></NavItem>
          <Menu mode="horizontal" className="dropdown">
            <SubMenu title={<span><span className="avatar-icon"><img src="https://gw.alipayobjects.com/zos/rmsportal/eHBsAsOrrJcnvFlnzNTT.png" /></span>刘认华<Icon type="uf-triangle-down"></Icon></span>}>
              <Menu.Item key="setting:2"><i className="uf uf-users-o"></i>个人中心</Menu.Item>
              <Menu.Item key="setting:3"><i className="uf uf-settings"></i>设置</Menu.Item>
              <Menu.Item key="setting:4"><i className="uf uf-plug-o"></i>退出登录</Menu.Item>
            </SubMenu>
          </Menu>
        </Nav>
      </Navbar>
    )
  }

}


export default Header
