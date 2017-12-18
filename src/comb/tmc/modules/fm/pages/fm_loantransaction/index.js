import React, { Component } from 'react';
import { hashHistory  } from 'react-router';
import {Breadcrumb, Table, Button, FormControl, Icon, Modal} from 'tinper-bee';
import './index.less';
//import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import Menu from 'bee-menus';
import Dropdown from 'bee-dropdown';

import LightTabs from './LightTabs';
// import Loadingstate from 'bee-loading-state';
import 'bee-loading-state/build/Loadingstate.css';
import Tabs, {TabPane} from 'bee-tabs';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import Ajax from '../../../../utils/ajax.js';
import FinancepayManage from '../fm_financepaymanage';
import RepayprcplManage from '../fm_repayprcplmanage';
import RepayInterestManage from '../fm_repayinterestmanage';
import Interest from '../fm_interest';
import FinanceLedger from '../fm_financeledger';
const MenuItem= Menu.Item;
const URL= window.reqURL.fm;

export default class LoanTransaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
            currentIndex:0,
            
        }
    }

    // componentWillMount() {
    //     localStorage.setItem('isFromload', false);
    // }

    componentDidMount() {
        
    }

    handleClick=(id)=>{
        // tab切换的方法
        this.setState({
            currentIndex:id
        });
    }

    handleChange=(id)=>{
        // tab切换的方法
        this.setState({
            currentIndex:id
        });
        console.log(id, '789');
    }

    // 面包屑数据
	//breadcrumbItem = [ { href: '#', title: '首页' }, { href: '#', title: '融资' }, { href: '#', title: '融资交易' }];

    render() {
        const loantabs =  [
            {
                isShow: true,
                title: '放款',
                content: '申请流程简单介绍',
                component: FinancepayManage,
                className: 'financepayActive',
                key: "0" ,
                name: 'financepaymanage'
            },
            {
                isShow: true,
                title: '还本',
                content: '还本流程简单介绍',
                component: RepayprcplManage,
                className: 'repayprcplActive',
                key: "1",
                name: 'repayprcplmanage'
            },
            {
                isShow: true,
                title: '计息',
                content: '计息流程简单介绍',
                component: Interest,
                className: 'interestActive',
                key: "2",
                name: 'interest'
            },
            {
                isShow: true,
                title: '付息',
                content: '付息流程简单介绍',
                component: RepayInterestManage,
                className: 'repayinterestActive',
                key: "3",
                name: 'repayinterestmanage'
            },
            {
                isShow: true,
                title: '融资台账',
                content: '台账流程简单介绍',
                component: FinanceLedger,
                className: 'financeledgerActive',
                key: "4",
                name: 'financeledger'
            }
        ];
        let {contstatus, contstatusGroup, statuslNum, keyWords, currentRecord, dataList, loadingShow, loanDetail, operationList} = this.state;
        
        return (
            <div className = "fm-loantransaction bd-wraps">
                {/* <BreadCrumbs items={this.breadcrumbItem} /> */}
                <Breadcrumb>
                    <Breadcrumb.Item href="#">首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#">融资</Breadcrumb.Item>
                    <Breadcrumb.Item active>贷款交易</Breadcrumb.Item>
                </Breadcrumb>
				
                <LightTabs activeKey={this.state.currentIndex} onChange={this.handleChange} items={loantabs} />
            </div>
        )
    }
}