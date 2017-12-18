import React, { Component } from 'react';
import { FormControl, Icon } from 'tinper-bee';
import './index.less';

export default class HistoryInput extends Component {
	static defaultProps = {
        dropHeight: 240,
        historyRecord: 20
    };
    
    constructor() {
		super();
		this.state = {
            historyList: [],
            variables: String(Math.random()).split('.')[1]
		};
    }

    componentDidMount () {
        document.body.addEventListener('click', this.queryHidden);
    }

    //关闭下拉框
	queryHidden = e => {
		let {historyShow, variables}= this.state;
		if (historyShow) {
			let select= document.getElementById(`history-input${variables}`);
            let len= e.path.findIndex((item) => item=== select);
			if (len < 0) {
				this.setState({
					historyShow: false
				});
			}
		}
	};
    
    //inputBlur
	inputBlur = (val, type) => {
        let {historyRecord}= this.props;
		let historyList = localStorage[type] ? localStorage[type].split('&&&') : [];
		let len= historyList.findIndex(item => item== val);
		if (len < 0 && val) {
			historyList.unshift(val);
		}
		if (historyList.length> historyRecord) {
			historyList.length= historyRecord;
		}
		localStorage[type]= historyList.join('&&&');
    };

	render() {
		let {historyList, historyShow, variables} = this.state;
        let {className, localType, placeholder, onSelect, dropHeight, ...other}= this.props;
        let iconClass= historyShow ? 'focus' : '';
		return (
			<div id={`history-input${variables}`} className={`${className} history-input`}>
                <FormControl 
                    ref='history_input'
                    {...other} 
                    placeholder={placeholder}
                    onFocus={() => {
                        let historyList = localStorage[localType] ? localStorage[localType].split('&&&') : [];
                        this.setState({
                            historyList,
                            historyShow: historyList.length ? true : false,
                        });
                    }}
                    onBlur={e => {this.inputBlur(e.target.value, localType);}}
                />
                <Icon className={`${iconClass} icon-arrow iconfont icon-icon-jiantouxia`}/>
                <ul 
                    className={historyShow ? 'history-list u-select-dropdown-menu show' : 'history-list u-select-dropdown-menu'}
                    style={{
                        minHeight: historyShow ? 28 : 0,
                        maxHeight: historyShow ? dropHeight : 0
                    }}
                >
                    <li className='history-item'>历史记录</li>
                    {
                        historyList.map((item, key) => {
                            return <li
                                key={key}
                                className='history-item active'
                                onClick={() => {
                                    this.setState({historyShow: false});
                                    onSelect(item);
                                }}
                            >
                                {item}
                            </li>
                        })
                    }
                </ul>
            </div>
		);
	}
}