import React,{Component} from 'react'
import mirror, {actions, connect,NavLink} from 'mirrorx'
import {Menu,Navbar,Icon,Breadcrumb} from 'tinper-bee';
import './sidebar.css';
const classNames = require('classnames');
const SubMenu = Menu.SubMenu;
const SideContainer = Menu.SideContainer;

mirror.model({
  name: 'app',
  initialState: {
    expanded:false,
    openKeys:[],
    menus:[],
  },
  reducers: {
    setExpanded(state,expanded) {
      const expand = expanded?false:!state.expanded;
      return {
        ...state,
        expanded:expand
      }
    },
    setOpenKeys(state,openKeys){
      return {
        ...state,
        openKeys:openKeys
      }
    },
    setMenus(state,menus){
      return {
        ...state,
        menus:menus
      }
    }
  }
})

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
        actions.app.setMenus(response.data.data)

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
    actions.app.setExpanded(true);
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
    actions.app.setOpenKeys(nextOpenKeys);
    //this.setState({openKeys: nextOpenKeys});
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
    let {expanded,openKeys,menus} = this.props;
    return (
      <div className={classNames({ 'sidebar-contanier':true,'sidebar-expanded': expanded })}>
        <div className="sider-menu">
          <div className="logo-box">
            <a href="#/">
              <span className="logo uf uf-tinperzch-col"></span>
              <h1>HoneyComb</h1>
            </a>
          </div>
          <SideContainer onToggle={this.onToggle.bind(this)} expanded={this.state.expanded}>
            <Menu mode="inline" className="wrapper-menu" openKeys={openKeys} selectedKeys={[this.state.current]}  onOpenChange={this.onOpenChange.bind(this)}  onClick={this.handleClick.bind(this)}>
              {

                menus.map(function (item) {

                  let blank = item.openview=="blank"?"_blank":"";


                  if(Array.isArray(item.children)&&item.children.length>0){
                    let list = [];
                    let title = (<a href="javascript:;"><i className={'icon '+item.icon}></i><span>{item.name}</span></a>);
                    item.children.map(function(it){
                      let blank =it.openview=="blank"?"_blank":"";
                      list.push(<Menu.Item key={it.id}>
                        <NavLink key={it.id} ref="child" to={it.location}>{it.name}</NavLink>
                      </Menu.Item>)
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

export default connect(state => {
  return state.app
})(Siderbar)

