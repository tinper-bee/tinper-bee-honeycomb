import React,{Component} from 'react'
import {Link} from 'mirrorx'
import {Menu,Navbar,Icon,Breadcrumb} from 'tinper-bee';
import { Scrollbars } from 'react-custom-scrollbars';
import './sidebar.css';


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const MenuToggle = Menu.MenuToggle;
const SideContainer = Menu.SideContainer;

const NavItem = Navbar.NavItem;
const Header = Navbar.Header;
const Brand = Navbar.Brand;
const Nav = Navbar.Nav;



class Siderbar extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedkey: 1,
      expanded: false,
      currentArray: [],
      openKeys: [],
      menu:[]
    }
    this.myfilter = this.myfilter.bind(this);
  }

  componentWillMount() {
    var self = this;

    axios.get('/web/v1/menu/sidebarList')
      .then(function (response) {
        self.setState({
          menu: response.data.data
        });

      }).catch(function (error) {
    });

  }



  handleSelect(index) {
    this.setState({selectedkey: index});
  }

  onToggle(value) {
    this.setState({expanded: value});
  }

  handleClick(e) {
    console.log('Clicked: ', e.key);
    this.setState({current: e.key});
  }
  onOpenChange(openKeys) {
    const state = this.state;
    const latestOpenKey = this.myfilter(openKeys,state.openKeys);
    const latestCloseKey = this.myfilter(state.openKeys,openKeys);

    /*   const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
       const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));*/

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      this.state.currentArray.push(latestCloseKey);
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({openKeys: nextOpenKeys});
  }
  //IE下 array.find（）方法不可用
  myfilter(arr1,arr2) {
    if(arr2.length == 0 || !arr2) {
      return arr1[0];
    }

    for(var i=0;i<arr1.length;i++)
    {
      if(arr2.indexOf(arr1[i].toString())==-1)
      {
        return arr1[i];
      }
    }
    return false;
  }
  getAncestorKeys(key) {

    const map = {
      "子项": ['组织2'],
    };

    return map[key] || [];
  }

  render() {
    return (
      <div className="sidebar-contanier">
        <div className="sider-menu">
          <div className="logo-box">
            <a href="#/">
              <span className="logo uf uf-tinperzch-col"></span>
              <h1>HoneyComb</h1>
            </a>
          </div>
          <SideContainer onToggle={this.onToggle.bind(this)} expanded={this.state.expanded}>
            <Menu mode="inline" className="wrapper-menu" openKeys={this.state.openKeys} selectedKeys={[this.state.current]}  onOpenChange={this.onOpenChange.bind(this)}  onClick={this.handleClick.bind(this)}>
              {

                this.state.menu.map(function (item) {
                  console.log(item);

                  let blank = item.openview=="blank"?"_blank":"";


                  if(Array.isArray(item.children)&&item.children.length>0){
                    let list = [];
                    let title = (<a href="javascript:;"><i className={'icon '+item.icon}></i><span>{item.name}</span></a>);
                    item.children.map(function(it){
                      let blank =it.openview=="blank"?"_blank":"";
                      list.push(<Menu.Item key={it.id}><a target={blank} ref="child" href={'#'+item.location}>{it.name}</a></Menu.Item>)
                    });

                    return (
                      <SubMenu key={item.id} children={item.children} title={title}>
                        {list}
                      </SubMenu>
                    )
                  }
                  else {
                    let title = (<a target={blank} href={'#'+item.location}><i className={'icon '+item.icon}></i><span>{item.name}</span></a>);
                    return (
                      <Menu.Item key={item.id} >{title}</Menu.Item>
                    )

                  }
                })
              }
            </Menu>
          </SideContainer>
        </div>
      </div>
    )
  }
}

export default Siderbar
