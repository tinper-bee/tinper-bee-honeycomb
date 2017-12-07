
import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'tinper-bee';
import {PublishReadFile} from '../serves/appTile';
import {splitParam,lintAppListData} from './util';

const outerClass = {
    width: '100%',
    background: '#000',
    borderRadius: 10,
    padding: "5px 15px",
    height: 600,
    overflowY: 'auto',
    color: "#fff",
    margin: "0 30px"
};



class PublishConsole extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.id,
            timeoutFlag:true,
        };
        this.addNews = this.addNews.bind(this);
        this.getPublishConsole = this.getPublishConsole.bind(this);
        this.consoleTimeOut = this.consoleTimeOut.bind(this);
    }
    componentWillReceviceProps(obj,nextProps){
        if(timeoutFlag) {
            return;
        }
        //this.setState({data:nextProps.data});
    }

    componentDidMount() {
        let self = this;
        if(!location.query || !location.query.key) {
            self.consoleTimeOut();
        }
    }

    componentWillUnmount(){
        window.clearInterval(self.publishTimer);
        window.clearInterval(self.consoleTimer);
    }

    addNews (oldData, newData) {

    }

    consoleTimeOut() {
        let taskList = sessionStorage.getItem("taskList&"+this.state.id);
        let timeconsole = 200;
        let self = this;

        self.consoleTimer = setInterval(function(){
            taskList = sessionStorage.getItem("taskList&"+self.state.id);
            
            if (!taskList) {
                timeconsole = timeconsole+200;
            }else{
                window.clearInterval(self.consoleTimer);
                //console.log("请求task所花"+timeconsole);
                self.getPublishConsole();
            }
        },timeconsole)
    }

    getPublishConsole(index=0) {

         let self = this;

        let fileLen;
        let taskList = JSON.parse(sessionStorage.getItem("taskList&"+this.state.id));
        if(!taskList || taskList.length==0) {
            return;
        };
        let taskid = taskList[index].id;
        
        let param = {
            task_id: taskid,
            app_id: this.state.id,
            filename: "stdout",
            offset:0,
            limit:100,
        }

        self.publishTimer = setInterval(function () {
            

            PublishReadFile(splitParam(param)).then(function(response){
                
                let consoleList = lintAppListData(response,null,null);

                if(!consoleList) {
                    window.clearInterval(self.publishTimer);
                };

                if(consoleList.data == "") {
                    window.clearInterval(self.publishTimer);
                }
                self.setState({
                    consoleData: self.state.consoleData+consoleList.data,
                    timeoutFlag:false,
                })

                param.offset = consoleList.data.length + consoleList.offset;

                //sessionStorage.setItem("console&"+self.state.id+'&'+taskid,self.state.consoleData);
                self.refs.view.scrollTop = self.refs.view.scrollHeight;
                

            }).catch(function() {
                window.clearInterval(self.publishTimer);
            })
        }, 3000)
        
    }
    render () {
        const { data, className } = this.props;

        return (
            <Row>
                <Col md={10}>
                    <textarea style={outerClass} ref="view" value={this.state.consoleData}>
                    </textarea>
                </Col>
            </Row>
        )
    }
}


export default PublishConsole;
