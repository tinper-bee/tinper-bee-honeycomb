// publics
import { Component, PropTypes } from 'react'
import {
    Modal,
    Button,
    Table,
    Pagination,
    Message,
    Upload,
    Select,
    Switch,
    FormControl,
    Row,
    Col,
    FormGroup,
    Navbar,
    Dropdown,
    Label,
    Popconfirm,
    Menu,
}from 'tinper-bee';
// self components
import withStyle from './withStyle.hoc'


const SubMenu = Menu.SubMenu;

class FromRow extends Component {


state = {
    deaultDropValue:"请进行点击选择",
    rowCount:1
  }

addRow = (event) =>{
   this.setState((prevState) => ({
      rowCount: prevState.rowCount + 1
    }))
    //console.log(this.state.rowCount);
}

  render() {
    const {style} = this.props;

    const onClick = function ({ key }) {
      message.info(`Click on item ${key}`);
    };

    const menu = (
      <Menu>
         <SubMenu title="sub menu"  onClick={
             this.handleClickItem }>
            <Menu.Item>3d menu item</Menu.Item>
            <Menu.Item>4th menu item</Menu.Item>
         </SubMenu>
        <SubMenu title="sub menu"  onClick={
            this.handleClickItem }>
            <Menu.Item>3d menu item</Menu.Item>
            <Menu.Item>4th menu item</Menu.Item>
        </SubMenu>
           <Menu.Item>
              <Popconfirm content={<FormControl />} id='aa' onClick={() => {}} onClose={() => {}}>
              <span>请点击输入</span>
            </Popconfirm>
             </Menu.Item>
      </Menu>
    );

     return (
        <div>
            <Row className="content">
                <Col md={11} xs={11} sm={11} className="">
                    <Row className="head">
                        <Col md={3} xs={3} sm={3} className="head-name">
                            <FormControl ref="userName" />
                        </Col>
                        <Col md={3} xs={3} sm={3} className="head-url">
                            <FormControl ref="userName" />
                        </Col>
                        <Col md={3} xs={3} sm={3} className="head-type">
                            <Dropdown.Button overlay={menu} trigger="click" style={style.menu}>
                  <span className="">
                      {this.state.deaultDropValue}
                  </span>
                            </Dropdown.Button>
                        </Col>
                        <Col md={3} xs={3} sm={3} className="head-level">
                            <FormControl ref="userName" />
                        </Col>
                    </Row>
                </Col>
                <Col md={1} xs={1} sm={1} className="head-url">
            <span onClick={this.addRow}>
              <i className="cl cl-add-c-o" />
            </span>
                </Col>
            </Row>
        </div>
     )
  }
}


export default withStyle(() => ({
  btn:{
    marginRight: 10
  },
  message:{
   marginTop:40,
   backgroundColor: "#F8F8F8",
   borderRadius: 3
  },
  messagefoot:{


  },
  menu:{
    zIndex:999999999
  }

}))(FromRow)

