import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Modal, Button, Switch } from 'tinper-bee';
import ShowDialog from './components/dialog/ShowDialog';

class AlrmInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            resouceName:this.props.resouceName
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
        this.closeAlam = this.closeAlam.bind(this);
        this.closeAramInfo = this.closeAramInfo.bind(this);


    }


    componentWillReceiveProps(props) {
        this.setState({
            showModal: props.show
        })
    }

    onConfirm(userId, showFlagEmail, showFlagTel) {
        const { onConfirmDelete, fresh } = this.props;
        onConfirmDelete && onConfirmDelete(userId, showFlagEmail, showFlagTel);
        this.setState({
            showModal: false
        });
    }
    closeAlam() {
        const { closeAramInfo } = this.props;
        if (closeAramInfo) closeAramInfo();
        this.setState({
            showModal: false
        });

    }
    open() {
        this.setState({
            showModal: true
        });
    }
    close() {
        this.setState({
            showModal: false
        });
    }
    closeAramInfo(){
        this.props.closeAramInfo();
    }

    onConfirmDelete() {
        this.props.onConfirmDelete();
    }


    handleConfirm = (userId, showFlagEmail, showFlagTel) => {
      let { checked } = this.props;
      if(checked){
        this.closeAlam();
      }else{
        this.onConfirm(userId, showFlagEmail, showFlagTel);
      }
    }

    render() {
        return (
            <span className="delete-key-modal">
                <span className="switch">
                    <span className="delete-key-modal">
                        <div>
                            <span
                                onClick={this.props.disabled ? '' : this.open}
                                className={classnames({ 'u-switch': true, 'is-checked': this.props.checked })}
                                tabIndex="0">
                                <span className="u-switch-inner"> </span>
                            </span>
                        </div>
                    </span>
                </span>

                      <ShowDialog
                        show={this.state.showModal}
                        name={this.state.resouceName}
                        checked={ this.props.checked }
                        onConfirm={this.handleConfirm}
                        close={this.close}
                      />
            </span>
        )
    }
}

export default AlrmInfo;
