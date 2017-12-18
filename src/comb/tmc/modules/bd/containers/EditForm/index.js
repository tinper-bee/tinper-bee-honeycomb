import React, { Component } from 'react';
import { Row, Modal, Form, FormGroup, FormControl, Label, Col, Button } from 'tinper-bee';

import Select from 'bee-select';
import 'bee-select/build/Select.css';

const Option = Select.Option;
const OptGroup = Select.OptGroup;


export default class EditForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemObj: {},
            proObj: {}
        }
        console.log(this.props, 'this.props');
    }

    commonApi = () => {
        let { proObj, type, itemObj } = this.state;
        if (type === 'ADD') {

            proObj.children = proObj.children || [];
            proObj.children.push({
                key: this.state.indexNum++,
                name: itemObj.name,
                type: itemObj.type,
                position: '1-1',
                age: 42,
                address: "New York No. 2 Lake Park"
            });
        }

        if (type === 'EDIT') {
            proObj.name = itemObj.name;
            proObj.type = itemObj.type;

        }
        // this.props.commonApi(this.state);
        this.props.commonApi(type);
    }

    close = () => {
        this.props.commonApi();
    }

    handleChange = (value) => {
        this.state.itemObj.type = value;
        console.log(this.state);
    }

    inputChange = (e) => {
        this.state.itemObj.name = e.target.value;
        this.setState();
    }

    componentWillReceiveProps(nextProps) {
        let { editType, itemObj, indexNum } = nextProps;
        // let { itemObj } = this.state;
        if (editType === 'EDIT') {
            this.state.itemObj.name = itemObj.name;
            this.state.itemObj.type = itemObj.type;
        }

        if (editType === 'ADD') {
            this.state.itemObj.name = '';
            this.state.itemObj.type = '';
        }

        this.setState((pre) => {
            return {
                ...pre,
                proObj: itemObj,
                indexNum: indexNum,
                type: editType
            }
        })
    }
    render() {
        return ( 
            <Modal show = { this.props.showModal }
                onHide = { this.close } >
                <Modal.Header >
                    <Modal.Title> 编辑 </Modal.Title> 
                </Modal.Header> 
                <Modal.Body>
                    <Form horizontal >
                        <Row >
                            <FormGroup >
                                <Col md = { 2 }
                                    sm = { 2 }
                                    className = "text-right" >
                                    <Label > 项目类型: </Label> 
                                </Col> 
                                <Col md = { 6 }
                                    sm = { 6 }
                                    xm = { 6 }> 
                                    <Select size="lg" 
                                        dropdownStyle={{ zIndex:18000 }} 
                                        defaultValue={ this.state.itemObj.type }
                                        onChange={this.handleChange}>
                                        <Option value="现金流入" >现金流入</Option>
                                        <Option value="现金流出" >现金流出</Option>
                                        <Option value="现金流入流出" >现金流入流出</Option>
                                        <Option value="空" >空</Option>
                                    </Select>
                                </Col> 
                            </FormGroup> 
                        </Row> 
                        <Row>
                            <FormGroup >
                                <Col md = { 2 }
                                    sm = { 2 }
                                    className = "text-right">
                                    <Label> 编码名称: </Label> 
                                </Col> 
                                <Col md = { 6 }
                                    sm = { 6 }
                                    xm = { 6 } >
                                    <FormControl value = { this.state.itemObj.name }
                                        onChange = { this.inputChange }
                                        size = "sm" / >
                                </Col> 
                            </FormGroup> 
                        </Row> 
                    </Form> 
                </Modal.Body> 
                <Modal.Footer>
                    <Button onClick = { this.close }
                        shape = "border"
                        style = {{ marginRight: 50 } }> 关闭 </Button> 
                    <Button onClick = { this.commonApi }
                        colors = "primary"> 确认 </Button> 
                </Modal.Footer> 
            </Modal>
        )
    }

}