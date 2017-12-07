import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {Modal,Button,FormGroup,FormControl,Label,Message} from 'tinper-bee';
import VerifyInput from '../components/verifyInput/index'
import axios from 'axios';
import {lintAppListData,getCookie} from '../components/util';

class EditRP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            requireFlag:true,
            name:''
        };
    }
    close = () => {
        this.setState({
            showModal: false
        });
    }
    onConfirm = () => {
        let self=this;
        const fresh=self.props.fresh;
        const id=self.props.rpId;
        let name=this.state.name;
        if(name){
            self.setState({
                requireFlag:true
            });
        }else{
            self.setState({
                requireFlag:false
            });
            return;
        }

        let params={
            Name: this.state.name
        };
         /**
          * 先进行当前资源池的查询，然后吧返回的结果，通过编辑接口在发送给后台
          */
         Promise.all([self.selectResouce(id)]).then((response) => {
            if(response&&Array.isArray(response)){
               response.map(function(item,index,response){
                    params.UserName=item.UserName;
                    params.UserId=item.UserId;
                    params.UpdateTime=item.UpdateTime;
                    params.Type=item.Type;
                    params.ProviderId=item.ProviderId;
                    params.IsFree=item.IsFree;
                    params.IsDefault=item.IsDefault;
                    params.Id=item.Id;
                    params.ExpireDuration=item.ExpireDuration;
                    params.Description=item.Description;
                    params.CreateTime=item.CreateTime;
                })


            }

            axios.put('/res-pool-manager/v1/resource_pool/'+id,params)
                    .then(function(res){
                        lintAppListData(res, null, '编辑成功');
                         fresh();
                        self.setState({
                            showModal: false
                        });
                    })
                    .catch(function(err){
                        console.log(err);
                        return Message.create({content: '请求出错', color: 'danger', duration: null});
                    });
            })
                .catch(() => {
                console.log('操作失败')
                })



    }

    /**
     * 根据资源池ID，进行资源池的查询
     */
    selectResouce = (id) => {
        const self = this;
        return axios.get('/res-pool-manager/v1/resource_pool/'+id)
            .then(function (res) {
             return res.data;
        })
        .catch(function (err) {
            if (!err['error_message']) {
                err['error_message'] = err.message
            }
            Message.create({ content: `操作失败，${err['error_message'].slice(0, 50)},请稍候重试刷新`, color: 'danger', duration: 1 })
            console.log(err.message);
        })
    }


    open = () => {
        this.setState({
            showModal: true,
            name:this.props.rpName
        });
    }

    handlerChange = () => {
        let self=this;
        self.setState({
            name: ReactDOM.findDOMNode(self.refs.name).value
        });
    }

    render () {
        return (
            <span className="mrp-edit">
                <i className="uf uf-pencil" title="编辑" onClick={this.open}/>
              <Modal show={ this.state.showModal  } keyboard={false} onHide={ this.close } backdrop={'static'}
                     className="mrp-add">
                        <div className="mrp-add" >
                            <Modal.Header >
                                <Modal.Title>编辑资源池</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <VerifyInput message="请输入资源池名称"  verify={/[\w\W]/} isModal isRequire>
                                <FormGroup>
                                    <Label>资源池名称：</Label>
                                    <FormControl ref="name" placeholder="请输入资源池名称" onChange={this.handlerChange}  value={this.state.name}/>
                                </FormGroup>
                                </VerifyInput>
                                <FormGroup className={classnames({'error':true,'hidden':this.state.requireFlag})}>
                                    <Label>
                                <span className="verify-warning show-warning">
                                    <i className="uf uf-exc-t-o"/>
                                    请输入资源池名称
                                </span>
                                    </Label>
                                </FormGroup>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button onClick={ this.close } shape="border" style={{marginRight: 50}}>取消</Button>
                                <Button onClick={ this.onConfirm } colors="primary">确认</Button>
                            </Modal.Footer>
                        </div>
                    </Modal>
          </span>
        )
    }
}

export default EditRP;
