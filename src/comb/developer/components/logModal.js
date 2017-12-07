
import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Row, Col, Button, Modal,Icon,InputGroup,FormControl,ButtonGroup,Popconfirm,Message} from 'tinper-bee';
import {PublishReadFile,PublishLogs,RunLogs} from '../serves/appTile';
import {splitParam,lintAppListData,spiliCurrentTime,dataPart} from './util';
import PageLoading from './loading/index.js'
const outerClass = {
    width: '100%',
    background: '#272822',
    padding: "5px 15px",
    height: '650px',
    overflowY: 'auto',
    color: "#fff",
    fontSize: '12px',
};



class LogModal extends Component {
    constructor(props){
        super(props);
        const {location} = this.props;

        this.state = {
            taskid: location.query.taskId,
            indexId: location.query.indexId,
            filename: location.query.filename,
            appid: location.query.appid,
            container_name: location.query.container_name,
            consoleData: [],
            cleanData: [],
            togglePauseFlag: false,
            offset: 0,
            indexFlag:0,
            scrollTop: 0,
            showModal:false,
            historyTimeYears: 2017,
            historyTimeMonths: 3,
            historyTimeWeeks: 1,
            historyTimeDays: 1,
            historyTimeHours: 12,
            historyTimeMinutes: 10,
            showLoading:false,
            timeoutFlag:false,
        };
        this.addNews = this.addNews.bind(this);
        this.getPublishConsole = this.getPublishConsole.bind(this);
        // this.consoleTimeOut = this.consoleTimeOut.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        //this.searchKey = this.searchKey.bind(this);
    }
    componentWillReceviceProps(obj,nextProps){
        var self = this;
        setTimeout(()=>{
          self.setState({showModal:self.props.show});
        });
    }

    componentDidMount() {
        let self = this;
        let currentTime = spiliCurrentTime();
        this.setState({
            historyTimeYears: currentTime.year,
            historyTimeMonths: currentTime.month,
            historyTimeWeeks: currentTime.week,
            historyTimeDays: currentTime.day,
            historyTimeHours: currentTime.hour,
            historyTimeMinutes: currentTime.minute,
        })
        //self.getPublishConsole();
        this.loopRunLogs();
    }

    componentWillUnmount(){
        window.clearInterval(this.loopRunLogTimer);
    }

    addNews (oldData, newData) {

    }

    /**
     * 暂停或者启动console轮询
     * @param
     */
    pauseConsole = () => {
        if(!this.state.togglePauseFlag) {
            this.setState({onScrollStop:true})
            window.clearInterval(this.loopRunLogTimer);
            delete this.loopRunLogTimer;
        }else {
            this.loopRunLogs();
            this.setState({onScrollStop:false});
        }
        this.setState({togglePauseFlag:!this.state.togglePauseFlag})
    }

    handleScroll = (e) => {

        let searchValue = ReactDom.findDOMNode(this.refs.searchValue).value;

        if(this.refs.view.scrollTop == 0) {
            if(!this.state.consoleData || !this.state.consoleData.length) return;
            let formateSearchTime = dataPart(new Date(this.state.consoleData[0].timestamp),'yyyy-MM-dd hh:mm:ss.S')
            let offset = this.state.consoleData[0].offset;
            let param = {
                appid: this.state.appid,
                search: searchValue,
                container_name: this.state.container_name,
                to_offset: offset-1,
                to_time: formateSearchTime,
            }
            this.searchLog(param,true);
            let self = this;
            setTimeout(function() {
                self.refs.view.scrollTop = 20;
            }, 100);
        }else if((this.refs.view.scrollTop + this.refs.view.offsetHeight) == this.refs.view.scrollHeight ) {
            if(this.state.searchHistoryFlag) {
                return;
            }
            if(searchValue != ""){
                let len = this.state.consoleData.length;
                let formateSearchTime = dataPart(new Date(this.state.consoleData[len-1].timestamp),'yyyy-MM-dd hh:mm:ss.S')
                let offset = this.state.consoleData[len-1].offset;
                let param = {
                    appid: this.state.appid,
                    search: searchValue,
                    container_name: this.state.container_name,
                    from_offset: offset+1,
                    from_time: formateSearchTime,
                }

                this.searchLog(param);
                this.refs.view.scrollTop = this.refs.view.scrollHeight;
            }else {
                window.clearInterval(this.loopRunLogTimer);
                delete this.loopRunLogTimer;
                this.loopRunLogs();
            }

        }

    }

    loopRunLogs = () => {
        let self = this;
        let formateSearchTime;
        let offset;

        self.loopRunLogTimer = setInterval(function () {
            if(self.state.consoleData.length>0) {
                let len = self.state.consoleData.length;
                formateSearchTime = dataPart(new Date(self.state.consoleData[len-1].timestamp),'yyyy-MM-dd hh:mm:ss.S');
                offset  = self.state.consoleData[len-1].offset;
            }else {
                formateSearchTime = '';
                offset = 0;
            }

            let param = {
                appid: self.state.appid,
                container_name: self.state.container_name,
                from_offset: offset+1,
                from_time: formateSearchTime,
            }

            if(!self.state.timeoutFlag) {
                self.setState({timeoutFlag:true});
                RunLogs(splitParam(param),function(response){

                    let consoleList = lintAppListData(response,null,null);

                    if(!consoleList || consoleList.error_code || !consoleList.length) {
                        window.clearInterval(self.loopRunLogTimer);
                        delete self.loopRunLogTimer;
                        //Message.create({content: "没有更多相关数据", color: 'warning',duration:1});
                        return;
                    };

                    consoleList = consoleList.reverse();
                    let overFlowLen;

                    if((consoleList.length+self.state.consoleData.length)>500) {
                        overFlowLen = consoleList.length+self.state.consoleData.length - 500;
                        let len = self.state.consoleData.length;
                        self.state.consoleData.split(len-overFlowLen,overFlowLen);
                    }

                    self.state.consoleData.push.apply(self.state.consoleData, consoleList);

                    self.setState({
                        consoleData: self.state.consoleData,
                        scrollTop: self.refs.view.scrollTop,
                        timeoutFlag:false,
                    })
                    self.refs.view.scrollTop = self.refs.view.scrollHeight;

                })
            }
        }, 1000)
    }

    searchByKey = () => {
        this.state.consoleData = [];
        let param = {
            appid: this.state.appid,
            container_name: this.state.container_name,
            search: ReactDom.findDOMNode(this.refs.searchValue).value,
        }
        if(param.search == "") {
            this.setState({searchHistoryFlag:false});
            window.clearInterval(this.loopRunLogTimer);
            delete this.loopRunLogTimer;
            this.loopRunLogs();
        }else {
            this.searchLog(param);
        }
    }
    /**
     * 搜索关键
     * @param preFlag:true 向前滚动
     */
    searchLog = (param,preFlag) => {
        let self = this;

        if(this.loopRunLogTimer) {
            this.setState({onScrollStop:true})
            window.clearInterval(this.loopRunLogTimer);
            delete this.loopRunLogTimer;
        }
        this.setState({showLoading:true});
        RunLogs(splitParam(param),function(response){

            let consoleList = lintAppListData(response,null,null);

            setTimeout(function() {
                self.setState({showLoading:false});
            }, 300);

            if(!consoleList || consoleList.error_code || !consoleList.length) {
                //window.clearInterval(self.loopRunLogTimer);
                Message.create({content: "没有更多相关数据", color: 'warning',duration:1});
                return;
            };

            consoleList = consoleList.reverse();
            let overFlowLen;
            if((consoleList.length+self.state.consoleData.length)>500) {
                overFlowLen = consoleList.length+self.state.consoleData.length - 500;
                let len = self.state.consoleData.length;
                self.state.consoleData.split(len-overFlowLen,overFlowLen);
            }

            if(preFlag) {
                consoleList.push.apply(consoleList,self.state.consoleData);
                self.setState({
                    consoleData: consoleList,
                })
            }else {
                self.state.consoleData.push.apply(self.state.consoleData, consoleList);
                self.setState({
                    consoleData: self.state.consoleData,
                })
            }



        })
    }


    onSearchHistoryConsole = () => {
        let toTime = this.state.historyTimeYears+'-'+this.state.historyTimeMonths+'-'+this.state.historyTimeDays+ " " +this.state.historyTimeHours+":"+this.state.historyTimeMinutes+":"+"00.000";
        this.state.consoleData = [];
        let param = {
            appid:this.state.appid,
            container_name: this.state.container_name,
            searchValue: ReactDom.findDOMNode(this.refs.searchValue).value,
            to_time:toTime
        }
        this.searchLog(param);
    }

    monthCal = (month) => {
        if(month>12) {
            this.setState({
                historyTimeYears: this.state.historyTimeYears+1,
                historyTimeMonths: month+1,
            })
        }else if(month <= 0) {
            this.setState({
                historyTimeYears: this.state.historyTimeYears-1,
                historyTimeMonths: month+12,
            })
        }else {
            this.setState({
                historyTimeMonths: month,
            })
        }
    }

    dayCal = (day) => {

        //day==31的情况
        if(day == 31) {
            //大月处理
            if(this.state.historyTimeMonths == 1 || this.state.historyTimeMonths == 3 || this.state.historyTimeMonths == 5 || this.state.historyTimeMonths == 7 || this.state.historyTimeMonths == 8 || this.state.historyTimeMonths == 10) {
                this.setState({
                    historyTimeDays: 31,
                })
            }else {
                this.setState({
                    historyTimeDays: 1,
                })
                let tempMonth = this.state.historyTimeMonths + 1;
                this.monthCal(tempMonth);
            }
            return;
        }
        if(day <= 0) {
            //大月处理
            if(this.state.historyTimeMonths == 3) {
                this.setState({
                    historyTimeDays: day+28,
                })
                let tempMonth = this.state.historyTimeMonths - 1;
                this.monthCal(tempMonth);
                return;
            }
            if(this.state.historyTimeMonths == 1 || this.state.historyTimeMonths == 5 || this.state.historyTimeMonths == 7 || this.state.historyTimeMonths == 8 || this.state.historyTimeMonths == 10 || this.state.historyTimeMonths == 12) {
                this.setState({
                    historyTimeDays: day+31,
                })
                let tempMonth = this.state.historyTimeMonths - 1;
                this.monthCal(tempMonth);
            }else {
                this.setState({
                    historyTimeDays: day+30,
                })
                let tempMonth = this.state.historyTimeMonths - 1;
                this.monthCal(tempMonth);
            }
            return;
        }

        if(day > 31) {
            this.setState({
                historyTimeDays: day - 31,
            })
            let tempMoth = this.state.historyTimeMonths + 1;
            this.monthCal(tempMoth);
            return;
        }else if(day <= 28 && day>0) {
            this.setState({
                historyTimeDays: day,
            })
            return;
        }else {
            if(this.state.historyTimeMonths != 2){
                this.setState({
                    historyTimeDays: day,
                })
                return;
            }else {
                this.setState({
                    historyTimeDays: day-28,
                })
                let tempMonth = this.state.historyTimeMonths + 1;
                this.monthCal(tempMonth);
                return;
            }
        }

    }

    hourCal = (hour) => {
        if(hour>24) {
            this.setState({
                historyTimeHours: hour-24,
            })
            let tempDay = this.state.historyTimeDays + 1;
            this.dayCal(tempDay);
        }else if(hour<0) {
            this.setState({
                historyTimeHours: hour+24,
            })
            let tempDay = this.state.historyTimeDays - 1;
            this.dayCal(tempDay);
        }else {
            this.setState({
                historyTimeHours: hour,
            })
        }
    }

    minuteCal = (minute) => {
        if(minute>60) {
            this.setState({
                historyTimeMinutes: minute-60,
            })
            let tempHour = this.state.historyTimeHours + 1;
            this.hourCal(tempHour);
        }else if(minute<0) {
            this.setState({
                historyTimeMinutes: minute+60,
            })
            let tempHour = this.state.historyTimeHours - 1;
            this.hourCal(tempHour);
        }else {
            this.setState({
                historyTimeMinutes: minute,
            })
        }
    }

    setSearchTime = (value,unit) => {
        let self = this;
        return function() {
            switch(unit) {
                case "months": {
                    let newMonth = self.state.historyTimeMonths+value;
                    self.monthCal(newMonth);
                    break;
                }
                case "days": {
                    let newDays = self.state.historyTimeDays+value;
                    self.dayCal(newDays);
                    break;
                }
                case "hours": {
                    let newHours = self.state.historyTimeHours+value;
                    self.hourCal(newHours);
                    break;
                }
                case "minutes": {
                    let newMinutes = self.state.historyTimeMinutes+value;
                    self.minuteCal(newMinutes);
                    break;
                }
            }

        }
    }

    getPublishConsole(index=0) {
        const {title,indexId} = this.props;


        let self = this;
        self.publishTimer = setInterval(function () {

            let param = {
                task_id: self.state.taskid,
                app_id: self.state.indexId,
                filename: self.state.filename,
                offset:self.state.offset,
                limit:2000,
            }
            PublishReadFile(splitParam(param)).then(function(response){

                let consoleList = lintAppListData(response,null,null);

                if(!consoleList || consoleList.error_code) {
                    window.clearInterval(self.publishTimer);
                    return;
                };

                //param.offset = consoleList.data.length + consoleList.offset;

                //sessionStorage.setItem("console&"+self.state.id+'&'+taskid,self.state.consoleData);
                self.refs.view.scrollTop = self.refs.view.scrollHeight;

                self.setState({
                    consoleData: `${self.state.consoleData}${consoleList.data}`,
                    cleanData:`${self.state.cleanData}${consoleList.data}`,
                    offset:consoleList.offset,
                    scrollTop: self.refs.view.scrollTop
                })

                if(self.refs.searchValue != '') {
                    self.searchKey();
                }else {
                    self.setState({consoleData:self.state.cleanData})
                }
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
        window.clearInterval(this.publishTimer);
        window.clearInterval(this.consoleTimer);
    }

    /**
     * 搜索关键
     * @param
     */
    searchKey = () => {
        //console.log("搜索内容");
    }


    // onSearchHistoryConsole = () => {
    //     let toTime = this.state.historyTimeYears+'-'+this.state.historyTimeMonths+'-'+this.state.historyTimeDays+ " " +this.state.historyTimeHours+":"+this.state.historyTimeMinutes+":"+"00";
    //     console.log("历史查询")
    //     let param = {
    //         appid:this.state.appid,
    //         container_name: this.state.container_name,
    //         to_time:toTime
    //     }
    //     PublishLogs(splitParam(param),function(response) {
    //         let res = response.lintAppListData(response,null,null);
    //         if(!res || res.error_code) {
    //             return;
    //         }

    //         self.setState({consoleData:res});
    //     })
    // }

    monthCal = (month) => {
        if(month>12) {
            this.setState({
                historyTimeYears: this.state.historyTimeYears+1,
                historyTimeMonths: month+1,
            })
        }else if(month <= 0) {
            this.setState({
                historyTimeYears: this.state.historyTimeYears-1,
                historyTimeMonths: month+12,
            })
        }else {
            this.setState({
                historyTimeMonths: month,
            })
        }
    }

    dayCal = (day) => {

        //day==31的情况
        if(day == 31) {
            //大月处理
            if(this.state.historyTimeMonths == 1 || this.state.historyTimeMonths == 3 || this.state.historyTimeMonths == 5 || this.state.historyTimeMonths == 7 || this.state.historyTimeMonths == 8 || this.state.historyTimeMonths == 10) {
                this.setState({
                    historyTimeDays: 31,
                })
            }else {
                this.setState({
                    historyTimeDays: 1,
                })
                let tempMonth = this.state.historyTimeMonths + 1;
                this.monthCal(tempMonth);
            }
            return;
        }
        if(day <= 0) {
            //大月处理
            if(this.state.historyTimeMonths == 3) {
                this.setState({
                    historyTimeDays: day+28,
                })
                let tempMonth = this.state.historyTimeMonths - 1;
                this.monthCal(tempMonth);
                return;
            }
            if(this.state.historyTimeMonths == 1 || this.state.historyTimeMonths == 5 || this.state.historyTimeMonths == 7 || this.state.historyTimeMonths == 8 || this.state.historyTimeMonths == 10 || this.state.historyTimeMonths == 12) {
                this.setState({
                    historyTimeDays: day+31,
                })
                let tempMonth = this.state.historyTimeMonths - 1;
                this.monthCal(tempMonth);
            }else {
                this.setState({
                    historyTimeDays: day+30,
                })
                let tempMonth = this.state.historyTimeMonths - 1;
                this.monthCal(tempMonth);
            }
            return;
        }

        if(day > 31) {
            this.setState({
                historyTimeDays: day - 31,
            })
            let tempMoth = this.state.historyTimeMonths + 1;
            this.monthCal(tempMoth);
            return;
        }else if(day <= 28 && day>0) {
            this.setState({
                historyTimeDays: day,
            })
            return;
        }else {
            if(this.state.historyTimeMonths != 2){
                this.setState({
                    historyTimeDays: day,
                })
                return;
            }else {
                this.setState({
                    historyTimeDays: day-28,
                })
                let tempMonth = this.state.historyTimeMonths + 1;
                this.monthCal(tempMonth);
                return;
            }
        }

    }

    hourCal = (hour) => {
        if(hour>24) {
            this.setState({
                historyTimeHours: hour-24,
            })
            let tempDay = this.state.historyTimeDays + 1;
            this.dayCal(tempDay);
        }else if(hour<0) {
            this.setState({
                historyTimeHours: hour+24,
            })
            let tempDay = this.state.historyTimeDays - 1;
            this.dayCal(tempDay);
        }else {
            this.setState({
                historyTimeHours: hour,
            })
        }
    }

    minuteCal = (minute) => {
        if(minute>60) {
            this.setState({
                historyTimeMinutes: minute-60,
            })
            let tempHour = this.state.historyTimeHours + 1;
            this.hourCal(tempHour);
        }else if(minute<0) {
            this.setState({
                historyTimeMinutes: minute+60,
            })
            let tempHour = this.state.historyTimeHours - 1;
            this.hourCal(tempHour);
        }else {
            this.setState({
                historyTimeMinutes: minute,
            })
        }
    }

    setSearchTime = (value,unit) => {
        let self = this;
        return function() {
            switch(unit) {
                case "months": {
                    let newMonth = self.state.historyTimeMonths+value;
                    self.monthCal(newMonth);
                    break;
                }
                case "days": {
                    let newDays = self.state.historyTimeDays+value;
                    self.dayCal(newDays);
                    break;
                }
                case "hours": {
                    let newHours = self.state.historyTimeHours+value;
                    self.hourCal(newHours);
                    break;
                }
                case "minutes": {
                    let newMinutes = self.state.historyTimeMinutes+value;
                    self.minuteCal(newMinutes);
                    break;
                }
            }

        }
    }

    // <textarea onScroll={this.handleScroll} spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" style={outerClass} ref="view" value={this.state.consoleData}>
    // </textarea>
    render () {
        const {title, data, className } = this.props;
        let currentConsoleData = this.state.consoleData;
        let popHistoryTime = (
            <div className="">
                <h4>跳转至  <span className="time-place year">{this.state.historyTimeYears}</span>年 <span className="time-place">{this.state.historyTimeMonths}</span>月 <span className="time-place">{this.state.historyTimeDays}</span>日 <span className="time-place">{this.state.historyTimeHours}</span>点 <span className="time-place">{this.state.historyTimeMinutes}</span>分 </h4>
                <ButtonGroup>
                    <Button shape='border' onClick={this.setSearchTime(-1,'days')}>昨天</Button>
                    <Button shape='border' onClick={this.setSearchTime(-2,'days')}>前天</Button>
                    <Button shape='border' onClick={this.setSearchTime(-7,'days')}>一周前</Button>
                    <Button shape='border' onClick={this.setSearchTime(-1,'months')}>上个月</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button shape='border' onClick={this.setSearchTime(5,'minutes')}>+ 5 分钟</Button>
                    <Button shape='border' onClick={this.setSearchTime(30,'minutes')}>+ 30分钟</Button>
                    <Button shape='border' onClick={this.setSearchTime(6,'hours')}>+ 6小时</Button>
                    <Button shape='border' onClick={this.setSearchTime(1,'days')}>+ 1天</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button shape='border' onClick={this.setSearchTime(-5,'minutes')}>- 5 分钟</Button>
                    <Button shape='border' onClick={this.setSearchTime(-30,'minutes')}>- 30分钟</Button>
                    <Button shape='border' onClick={this.setSearchTime(-6,'hours')}>- 6小时</Button>
                    <Button shape='border' onClick={this.setSearchTime(-1,'days')}>- 1天</Button>
                </ButtonGroup>
            </div>
         );
        return (
        <div style={{ padding: 10, border: "1px solid #e1e1e1", background: "#f5f5f5"}}>
            <div style={outerClass} ref='view' onScroll={this.handleScroll}>
                <ul>
                    {
                        currentConsoleData && currentConsoleData.map(function (item, index) {

                            return (
                                <li key={index} timestamp={item.timestamp} offset={item.offset} dangerouslySetInnerHTML={{__html:item.message}}></li>
                            )
                        })
                    }
                </ul>
                <PageLoading show={this.state.showLoading}/>
            </div>
            <div className="console-edit">
                <Button className="edit-icon" size="sm" onClick={this.pauseConsole}>

                    {!this.state.togglePauseFlag && (<span><i className="cl cl-suspend"></i>暂停</span>)}{this.state.togglePauseFlag && (<span><i className="cl cl-play-o"></i>滚动</span>)}
                </Button>
                <Popconfirm className="popover-history" trigger="click" placement="top" content={popHistoryTime} onClose={this.onSearchHistoryConsole}>
                    <Button className="edit-icon" size="sm"><i className="cl cl-find"></i>历史</Button>
                </Popconfirm>
                <InputGroup>
                    <FormControl placeholder="搜索关键字" ref="searchValue" style={{ borderRadius: 0, fontSize: 12,width:200 }}/>
                    <Button className="edit-icon" onClick={this.searchByKey} style={{marginTop:-3}}>搜索</Button>
                </InputGroup>
            </div>


        </div>

        )
    }
}


export default LogModal;
