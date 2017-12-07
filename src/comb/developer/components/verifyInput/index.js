import react, { Component, PropTypes } from 'react';
import { FormControl, Icon, InputGroup, Button, Message } from 'tinper-bee';
import classnames from 'classnames';
import styles from './index.css';

function verifyIt(verify, value) {
    if (verify.exec) {
        return verify.test(value)
    }

    return !!verify(value);
}

const propTypes = {
    message: PropTypes.string,
    isModal: PropTypes.bool,
    isRequire: PropTypes.bool,
    children: PropTypes.element,
    verify: React.PropTypes.oneOfType([
        React.PropTypes.func,
        React.PropTypes.instanceOf(RegExp)
    ]),
    verifyClass: PropTypes.string,
    feedBack: PropTypes.func,
};

const defaultProps = {
    message: '内容格式错误',
    isModal: false,
    isRequire: false,
    verify: /.*/,
    verifyClass: '',
    /*
     * blur: 失去焦点是校验
     * change: onChange事件触发是校验
     */
    method: 'blur',
    /*
     * 将结果反馈给父级组件，
     * 用于通知父级组件当前输入框的状态是否符合校验正则
     */
    feedBack: () => {
    },
};

class VerifyInput extends Component {
    static defaultProps = defaultProps;
    static propTypes = propTypes;
    state = {
        showMessage: false
    };

    handleBlur = (e) => {
        let {
            isRequire = false,
            verify = /.*/,
            children,
            method
        } = this.props;
        let value = e.target.value.replace(/(^\s+)|(\s+$)/g, "");
        let {
            onBlur = () => {
        }
        } = children.props;


        if (method !== 'blur' && !isRequire) {
            onBlur(e);
            return;
        }

        if ((!isRequire && value === '') || verifyIt(verify, value)) {
            this.props.feedBack(true);
            this.setState({
                showMessage: false
            })
        } else {
            this.props.feedBack(false);
            this.setState({
                showMessage: true
            })
        }

        onBlur(e);
    }

    handleChange = (e) => {
        let {
            isRequire = false,
            verify = /.*/,
            children,
            method,
        } = this.props;
        let {
            onChange = () => {
        }
        } = children.props;
        let value = e.target.value;
        if (value.indexOf(" ") >= 0) {
            // Message.create({
            //     content: '您输入的内容首位空格会被截取掉',
            //     color: 'danger',
            //     duration: 3
            // });
        }

        if (method !== 'change') {
            onChange(e);
            return;
        }

        if ((!isRequire && value === '') || verifyIt(verify, value)) {
            this.props.feedBack(true);
            this.setState({
                showMessage: false
            })
        } else {
            this.props.feedBack(false);
            this.setState({
                showMessage: true
            })
        }

        onChange(e);

    }
    /*renderChildren() {
     const {
     message,
     isModal,
     isRequire,
     verify,
     verifyClass,
     method,
     feedBack,
     children,
     ...others
     } = this.props;
     if (isModal) {
     return (
     <InputGroup simple>
     {React.cloneElement(children, { ...others, onBlur: this.handleBlur, onChange: this.handleChange })}
     <InputGroup.Button shape="border">
     <Button><span className="cl cl-pass-c" style={{ color: '#4CAF50' }}>dfg</span></Button>
     </InputGroup.Button>
     </InputGroup>
     )
     } else {
     return React.cloneElement(children, { ...others, onBlur: this.handleBlur, onChange: this.handleChange });
     }
     }*/

    render() {
        const {
            message,
            verifyClass,
            children,
            ...others
        } = this.props;

        let classes = {
            // "verify-bg": !isModal,
            "show-warning": this.state.showMessage
        }


        return (
            <div className={verifyClass ? verifyClass : 'verify'}>
                {
                    React.cloneElement(children, {
                        ...others,
                        onBlur: this.handleBlur,
                        onChange: this.handleChange,
                    })
                }

                <span className={classnames("verify-warning", classes)}>
                    {/*{isModal ? (<Icon type="uf-exc-t-o"></Icon>) : ""}*/}
                    <Icon type="uf-exc-t-o" />
                    {message}
                </span>
            </div>
        )
    }
}

VerifyInput.propTypes = propTypes;
VerifyInput.defaultProps = defaultProps;


export default VerifyInput;
