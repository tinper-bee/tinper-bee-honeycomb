import React, { Component } from "react";
import {
Row,
Col,
Button,
Modal,
Icon
} from "tinper-bee";
import { Link } from "react-router";
import "./index.less";

export default class InfoModal extends Component{

    static defaultProps = {
        show: true,
        type: "success",
        messageTitle: "",
        messageText: "",
        lButtonText: "确定",
        rButtonText: "取消",
        lLink: "#",
        rLink: "#"
	};

    render(){
        let typeClass;
        switch(this.props.type)
        {
        case "success":
            typeClass = "iconfont icon-tishianniuchenggong";
            break;
        case "careful":
            typeClass = "iconfont icon-tishianniuzhuyi";
            break;
        case "remind":
            typeClass = "iconfont icon-tishianniutixing";
            break;
        case "error":
            typeClass = "iconfont icon-tishianniuguanbi";
            break;
        default:
            typeClass = "iconfont icon-tishianniuchenggong";
        }
        return (
            <Modal
                id="info-modal"
                show = { this.props.show }
                onHide = { this.props.onHide }>                              
                <Modal.Header closeButton={true}>
                </Modal.Header>
    
                <Modal.Body style={{paddingTop: 10, paddingLeft: 15, paddingRight: 15, paddingBottom: 40}}>
                    <Row>
                        <div className="message-title">
                            <Col md={1} xs={1} sm={1} xsOffset={1} sm={1} smOffset={1}>
                                <div><Icon className={typeClass} style={{fontSize: 21}}/></div>                                               
                            </Col>
                            <Col md={10} xs={10} sm={10}>
                                {this.props.messageTitle}                 
                            </Col>
                        </div>     
                        <Col md={11} xs={11} sm={11} xsOffset={2} sm={2} smOffset={2}>
                            <div className="message-text">{this.props.messageText}</div>
                        </Col>
                    </Row>
                </Modal.Body>
    
                <Modal.Footer id="mdoal-footer">
                    {typeof this.props.lLink == "undefined" || this.props.lLink == "" ? 
                        <Button style={{marginRight: 10}} onClick={this.props.onClose}>{this.props.lButtonText}</Button>
                    : <Link to={this.props.lLink}>
                        <Button style={{marginRight: 10}}>{this.props.lButtonText}</Button>
                    </Link>}
                    {typeof this.props.rLink == "undefined" || this.props.rLink == "" ? 
                        <Button 
                            style={{marginRight: 10, background: "#ffffff", color: "#666666", borderWidth: 1, borderStyle: "solid", borderColor: "#D9D9D9"}} 
                            onClick={this.props.onClose}>{this.props.rButtonText}
                        </Button>
                    : <Link to={this.props.rLink}>
                        <Button 
                            style={{marginRight: 10, background: "#ffffff", color: "#666666", borderWidth: 1, borderStyle: "solid", borderColor: "#D9D9D9"}}>
                        {this.props.rButtonText}
                        </Button>
                    </Link>}                  
                </Modal.Footer>
            </Modal>
        );
    }   
}
            