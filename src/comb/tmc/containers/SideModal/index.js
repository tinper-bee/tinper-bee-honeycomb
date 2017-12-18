import React, { Component } from "react";
import { Modal } from "tinper-bee";
import "./index.less";

export default class SideModal extends Component {
    static defaultProps = {
        showModal: false,
        title:'消息'
    }

    constructor(props) {
        super(props);
		this.suffix = String(Math.random()).split('.')[1];
    }

    render() {
        return (
            <Modal
                backdrop={true}
                show={this.props.showModal}
                size='lg'
                onHide={this.props.close}
                dialogClassName={`side-modal slide_body modal${this.suffix} ${this.props.showModal ? "slide_in" : "slide_out"}`}
                backdropStyle={{ background: 'rgba(0, 0, 0, 0.5)', transition: 'all 0.5s' }}
                onEnter={() => {
                    document.getElementsByClassName(`modal${this.suffix}`)[0].parentElement.style.display = 'flex'
                    document.getElementsByClassName(`modal${this.suffix}`)[0].parentElement.style.justifyContent = 'flex-end'
                    document.getElementsByClassName(`modal${this.suffix}`)[0].parentElement.style. alignItems = 'center' 
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
            </Modal>
        );
    }
}    