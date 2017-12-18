import { Con, Row, Col } from 'bee-layout';
import { Panel } from 'bee-panel';
import React, { Component } from 'react';
import Button from 'bee-button';
import Modal from 'bee-modal';
export default class Modalimg extends Component {

    render() {
        return (
            <div className="padding-15" onClick={this.close}>
                <Modal 
                    show={ this.props.showModal }
                    onHide={ this.props.onClick }
                    onClick={this.props.onClick}
                    >
                    <Modal.Body id='modalimg'>
                       <img src={this.props.licenseUrl} style={{width:'100%'}} alt=""/>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}
