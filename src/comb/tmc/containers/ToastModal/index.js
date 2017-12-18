import React ,{Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'tinper-bee';
import './index.less';

export default class ToastModal extends Component{
    static defaultProps = {
        duration: 3,
        size: 'mds',
        color: 'success',
        isRemind: false,
        content: '成功了,哈哈哈...',
        title: '成功了'
    };
    constructor() {
		super();
    }

    componentDidMount () {
        this.closeTimer= setTimeout(() => {
            let {isRemind, size}= this.props;
            let isShow= isRemind ? `toast-zijinyun-project-${size}` : 'toast-zijinyun-project';
            this.closeToast(isShow, true);
        }, this.props.duration*1000);
    }
    
    //删除toast弹框
    closeToast = (ele, isDelete) => {
        let element= document.getElementsByClassName(ele)[0];
        if (element) {
            ReactDOM.unmountComponentAtNode(element);
            clearTimeout(this.closeTimer);
            this.closeTimer= null;
            if (isDelete) {
                document.getElementById('app').removeChild(element);
            }
        }
    }

    render() {
        let {size, color, isRemind, content, title}= this.props;
        if (size !== 'mds') {
            isRemind= false;
        }
        let className= `toast-modal ${size} ${color}`;
        let toastIcon = (size, color) => {
            let iconName= 'icon-tishianniuchenggong';
            if (color=== 'danger') {
                iconName= 'icon-tishianniuguanbi';
            } else if (color=== 'warning') {
                iconName= 'icon-tishianniuzhuyi';
            } else if (color=== 'info') {
                iconName= 'icon-tishianniutixing';
            }
            let name= `toast-icon iconfont ${iconName} ${color}`;
            return <Icon className={name}/>;
        };
        let closeIcon= (size, isRemind) => {
            if (isRemind && size=== 'mds') {
                return <span 
                    className="isRemind"
                    onClick={() => {
                        this.closeToast(`toast-zijinyun-project-${size}`, false);
                    }}
                >不再提醒</span>;
            } else if (size!== 'sms') {
                return <Icon 
                    className='close-icon iconfont icon-guanbi'
                    onClick={() => {
                        this.closeToast('toast-zijinyun-project', true);    
                    }}
                />;
            }
        };
        let showContent= (size, content, title) => {
            if (size=== 'lgs') {
                return <div className="toast-box">
                    <div className="toast-title">{title}</div>
                    <div className="toast-content">{content}</div>
                </div>;
            } else {
                return <span className='toast-content'>{content}</span>;
            }
        };
        return <div className='toast-mask-modal' ref='toast_mask'>
            <div className={className} ref='toast'>
                {toastIcon(size, color)}
                {showContent(size, content, title)}
                {closeIcon(size, isRemind)}
            </div>
        </div>
    }
}