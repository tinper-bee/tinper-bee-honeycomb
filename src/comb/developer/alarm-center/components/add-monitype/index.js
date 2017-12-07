import React, {Component} from 'react'
import ReactDOM from 'react-dom';

import { Label, Row, Col, Rows, Message, FormControl, InputGroup, FormGroup} from 'tinper-bee';


import Slider,{ Handle } from 'rc-slider';
import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';
import classnames from 'classnames';

import onlyNumber from '../../../lib/verification';

import './index.less';


class AddMoniType extends Component {

	constructor(...args) {
	super(...args);

	this.state={
    memLeft: 1,
    cpuLeft: 1,
    diskLeft: 1
    }
}

 renderHandle = (props) => {
    const {value, ...restProps} = props;

    return (
      <Handle {...restProps}>
        { `${this.toPercent(value)}` }
      </Handle>
    );
  }

  toPercent = (point) =>{
    return ((point * 100).toFixed(0) + "%");

  }

render(){
	let {monitype, onchangeType, mem, cpu, disk, handleSelect} = this.props;

	return (
		<div className="alarm-add-monitype">

		    <Col md={12} className="monitype-group">
		         <Row>
		            <Col md={3}>
		              <Label>监控类型</Label>
		            </Col>
		            <Col md={9}>
                  <div
		                className={classnames("monitype-btn", {"active": true})}>
                  <i className="cl cl-chain" style={{fontSize:22}}></i>
		                主机状态
                  </div>
                  <div
		                className={classnames("monitype-btn", {"active": monitype.indexOf('host_perform') > -1})}
		                onClick={onchangeType('host_perform')}>
                  <i className="cl cl-piechart" style={{fontSize:22}}></i>
		                主机性能
                  </div>
               </Col>
		         </Row>
		    </Col>

		<div className="perform-group"  contenteditable= { monitype.indexOf('host_perform') > -1 }>
      <Col  md={12} className="divier" >
      <Row>
          <Col md={3} >
            <Label>阈值设置</Label>
          </Col>
        <Col md={9} className="padding-0">

            <Col md={12}>
              <Label>内存</Label>
            </Col>
            <Col md={8}>
              <div style={{marginTop: 5}}>
                <Slider
                  style={{width: "100%"}}
                  disabled={this.props.monitype.indexOf('host_perform')<= -1 ? true : false}
                  min={0}
                  max={this.state.memLeft}
                  step='0.01'
                  value={this.props.mem < this.state.memLeft ? (this.props.mem) : this.state.memLeft }
                  onChange={this.props.handleSelect('mem')}
                  handle={this.renderHandle}/>
              </div>
            </Col>
          <Col md={3} style={{paddingLeft: 25}}>
            <InputGroup>
              <FormControl
                style={{imeMode: 'Disabled'}}
                disabled={this.props.monitype.indexOf('host_perform')<= -1 ? true : false}
                onkeyup="this.value=this.value.replace(/\D/g,'')"
                onChange={this.props.handleInputChange('mem')}
                value={this.props.mem < this.state.memLeft ? this.toPercent(this.props.mem) : this.toPercent(this.state.memLeft) }/>

              </InputGroup>
          </Col>

            <Col md={12}>
              <Label>cpu</Label>
            </Col>
            <Col md={8}>
              <div style={{marginTop: 5}}>
                <Slider
                  style={{width: "100%"}}
                  disabled={this.props.monitype.indexOf('host_perform')<= -1 ? true : false}
                  min={0}
                  max={this.state.cpuLeft}
                  step='0.01'
                  value={this.props.cpu < this.state.cpuLeft ? (this.props.cpu) : (this.state.cpuLeft)}
                  onChange={this.props.handleSelect('cpu')}
                  handle={this.renderHandle} />
              </div>
            </Col>

            <Col md={3}  style={{paddingLeft: 25}}>
              <InputGroup>
                <FormControl
                  style={{imeMode: 'Disabled'}}
                  disabled={this.props.monitype.indexOf('host_perform')<= -1}
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  onChange={this.props.handleInputChange('cpu')}
                  value={this.props.cpu < this.state.cpuLeft ? this.toPercent(this.props.cpu) : this.toPercent(this.state.cpuLeft)}/>

              </InputGroup>
            </Col>

            <Col md={12}>
              <Label>磁盘</Label>
            </Col>
            <Col md={8}>
              <div style={{marginTop: 5}}>
                <Slider
                  style={{width: "100%"}}
                  disabled={this.props.monitype.indexOf('host_perform')<= -1 ? true : false}
                  min={0}
                  max={this.state.diskLeft}
                  step='0.01'
                  value={this.props.disk < this.state.diskLeft ? (this.props.disk) : (this.state.diskLeft)}
                  onChange={this.props.handleSelect('disk')}
                  handle={this.renderHandle} />
              </div>
            </Col>

            <Col md={3}  style={{paddingLeft: 25}}>
              <InputGroup>
                <FormControl
                  style={{imeMode: 'Disabled'}}
                  disabled={this.props.monitype.indexOf('host_perform')<= -1 ? true : false}
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  onChange={this.props.handleInputChange('disk')}
                  value={this.props.disk  < this.state.diskLeft ? this.toPercent(this.props.disk) : this.toPercent(this.state.diskLeft)}/>
              </InputGroup>
            </Col>
          </Col>

	        </Row>
	      </Col>
	     </div>
      </div>
	)
}
}

AddMoniType.defaultProps = {
  monitype: []
}

export default AddMoniType
