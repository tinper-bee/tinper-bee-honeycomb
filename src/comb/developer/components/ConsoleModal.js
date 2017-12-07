
import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Modal} from 'tinper-bee';
import {PublishReadFile} from '../serves/appTile';
import {splitParam,lintAppListData} from './util';

const outerClass = {
    width: '100%',
    background: '#000',
    borderRadius: 10,
    padding: "5px 15px",
    height: '800px',
    overflowY: 'auto',
    color: "#fff",
    fontSize: '12px',
};



class ConsoleModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            taskid: this.props.taskId,
            indexId: this.props.indexId,
            filename: this.props.filename,
            consoleData: '',
            showModal:false,
        };
        this.addNews = this.addNews.bind(this);
        this.getPublishConsole = this.getPublishConsole.bind(this);
        // this.consoleTimeOut = this.consoleTimeOut.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }
    componentWillReceviceProps(obj,nextProps){
        var self = this;
        setTimeout(()=>{
          self.setState({showModal:self.props.show});
        });
    }

    componentDidMount() {
        let self = this;

        self.getPublishConsole();

    }

    componentWillUnmount(){
        window.clearInterval(self.publishTimer);
        window.clearInterval(self.consoleTimer);
    }

    addNews (oldData, newData) {

    }

    getPublishConsole(index=0) {
        const {title,indexId} = this.props;

        let param = {
            task_id: this.state.taskid,
            app_id: this.state.indexId,
            filename: this.state.filename,
            offset:0,
            limit:100,
        }
        let self = this;
        self.publishTimer = setInterval(function () {


            PublishReadFile(splitParam(param)).then(function(response){

                let consoleList = lintAppListData(response,null,null);

                if(!consoleList || consoleList.error_code) {
                    window.clearInterval(self.publishTimer);
                };

                if(consoleList.data == "") {
                    window.clearInterval(self.publishTimer);
                }


                self.setState({
                    consoleData: self.state.consoleData+consoleList.data
                })


                

                param.offset = consoleList.data.length + consoleList.offset;

                //sessionStorage.setItem("console&"+self.state.id+'&'+taskid,self.state.consoleData);
                self.refs.view.scrollTop = self.refs.view.scrollHeight;

                //self.getPublishConsole(index);

            }).catch(function() {
                window.clearInterval(self.publishTimer);
            })
        }, 200)

    }

    open() {
        this.getPublishConsole();
        this.setState({
            showModal: true
        });
    }

    close() {
        this.setState({
            showModal: false
        });
        const {onCancelCallBack} = this.props;
          if(onCancelCallBack){
            onCancelCallBack();
        }
        window.clearInterval(this.publishTimer);
        window.clearInterval(this.consoleTimer);
    }

    render () {
        const {className } = this.props;

        return (
              
            <Modal
              show = { this.state.showModal }
              onHide = { this.close } >

                  <Modal.Body>
                        <textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" disabled style={outerClass} ref="view" value={this.state.consoleData}>
                        </textarea>
                  </Modal.Body>

                  <Modal.Footer>
                      <Button onClick={ this.close }>关闭</Button>
                  </Modal.Footer>
             </Modal>   

        )
    }
}


export default ConsoleModal;
