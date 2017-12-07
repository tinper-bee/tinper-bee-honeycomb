import React,{Component} from 'react';
import axios from 'axios';
import {Col,Con,Row,Button,Icon,Table,Alert,Message,InputGroup,FormControl } from 'tinper-bee';
import Bind from './Bind';
import Unbind from './Unbind';
import {loadHide,loadShow} from '../components/util';
import {domainListData} from './LoadList'
import style from './index.css';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DomainList: [],
            childDoMain:this.props.domain
        };
        this.onDelete = this.onDelete.bind(this);
        this.onFreshData = this.onFreshData.bind(this);
        this.handleReFresh = this.handleReFresh.bind(this);
    }

    onFreshData(reFreshFlag) {

        const self = this;
        //loadShow.call(self);
        let appId = this.props.appid;
        axios.get('/edna/web/v1/domain/listUserDomains?appId=' + appId)
            .then(function (response) {

                let domainList = domainListData(response, null, null, reFreshFlag).bindList;
                if (!domainList) return;
                domainList.forEach(function (item, index) {
                    item.key = index;
                });
                self.setState({DomainList: domainList});
            })
            .catch(function (err) {

                console.log('error');
                Message.create({content: '请求错误', color: 'danger',duration: null});
            });
    }

    componentDidMount() {
        this.onFreshData();
    }

    onDelete(index) {
        const self = this;
        return function () {
            const domainList = self.state.DomainList;
            let param = self.state.DomainList[index].id;

            //loadShow.call(self);
            axios.delete('/edna/web/v1/domain/delById?id=' + param)
                .then(function (response) {
                    //loadHide.call(self);

                    domainListData(response, "操作失败", "操作成功");
                    domainList.splice(index, 1);
                    self.setState({DomainList: domainList})
                })
                .catch(function (err) {

                    Message.create({content: '请求错误', color: 'danger',duration: null});
                    console.log("error");
                });
            self.setState({DomainList: domainList});
        };
    }

    handleReFresh() {
        const self = this;
        let reFreshFlag = true;
        self.onFreshData(reFreshFlag);
    }

    render() {
        const self = this;
        const columns = [
            {title: '已绑定域名', dataIndex: 'domain', key: 'domain', render(text){
                return (<a href={`http://${text}`} target="_blank">{text}</a>)
            }},
            {title: '解析状态', dataIndex: 'resolveStatus', key: 'resolveStatus'},
            {
                title: '备案状态', dataIndex: 'ts', key: 'ts', render(){
                return (<span>已备案</span>);
            }
            },
            {
                title: '操作', dataIndex: 'e', key: 'e', className: 'text-right', render(text, record, index) {
                return (<span><Unbind onConfirmDelete={self.onDelete(index)} title={ '解绑' }/></span>);
            }
            }
        ];
        return (
            <div className="domain"><span ref="pageloading"> </span>
                <div className="key-table-warning">
                    <Alert colors="warning">
                        <Icon type="uf-exc-t-o" />
                        <span className="alert-text">如果您的域名还没有备案，请先备案</span>
                    </Alert>
                </div>
                <Col md={12} className="key-table-head">
                    访问地址
                </Col>
                <Col md={12} className="child border">
                    <InputGroup>
                        <InputGroup.Addon>http://</InputGroup.Addon>
                        <FormControl type="text" readOnly value={this.state.childDoMain} />
                    </InputGroup>
                </Col>
                <Col md={6} className="key-table-head">
                    自定义域名
                </Col>
                <Col md={6} className="key-table-operate">
                    <Bind appid={this.props.appid} title={ '绑定域名' }/>
                    <Button style={{ marginLeft: 20 }} shape="squared" id="refresh" onClick={this.handleReFresh}>刷新</Button>

                </Col>
                <Col md={12} className="key-table-list">
                    <Table columns={columns} data={this.state.DomainList} emptyText={() => '当前暂时还没有数据'}/>
                </Col>
            </div>
        )
    }
}

export default MainPage;
