import React, {Component} from 'react'
import {
    Modal,
    Button,
    Message,
    Label,
    Col,
    InputGroup,
    Icon,
} from 'tinper-bee';
import { modifyAuth} from '../../serves/confLimit';
import classnames from 'classnames';

import '../authModal/index.css';


class ModifyModal extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            role: 'user',
        }
    }

    componentWillReceiveProps(nextProps) {
        let {role} = nextProps;
        this.setState({
            role
        })

    }


    /**
     * 修改事件
     */
    handleModify = () => {
        let {userId, onEnsure, onClose} = this.props;
        let {role} = this.state;

        let param = {
            id: userId,
            daRole: role
        };


        //邀请用户
        modifyAuth(param).then((res) => {
            if (!res.data.error_code) {
                Message.create({
                    content: '修改成功',
                    color: 'success',
                    duration: 1.5
                });
                onEnsure && onEnsure();
                onClose && onClose();
            } else {
                Message.create({
                    content: res.data.error_message,
                    color: 'danger',
                    duration: null
                });
                onClose && onClose();
            }
        })
    }

    /**
     * 权限选择
     * @param value
     */
    handleChange = (value) => {
        return () => {
            this.setState({
                role: value
            })
        }
    }


    render() {

        let {show, onClose} = this.props;

        return (
            <Modal
                show={ show }
                className="auth-modal"
                onHide={ onClose }>
                <Modal.Header>
                    <Modal.Title>修改权限</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="role-group">
                        <Label style={{ marginRight: 15 }}>授予权限</Label>
                        <div
                            className={classnames("role-btn",{"active": this.state.role === 'owner'})}
                            onClick={this.handleChange('owner')}>
                            <span className="role-owner role-margin"/>
                            管理权限
                        </div>
                        <div
                            className={classnames("role-btn",{"active": this.state.role === 'user'})}
                            onClick={this.handleChange('user')}>
                            <span className="role-user role-margin"/>
                            使用权限
                        </div>


                    </div>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button
                        onClick={onClose}
                        style={{margin: "0 20px 40px 0"}}>
                        取消
                    </Button>
                    <Button
                        onClick={this.handleModify}
                        colors="primary"
                        style={{marginBottom: "40px"}}>
                        授权
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ModifyModal;