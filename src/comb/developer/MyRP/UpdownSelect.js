/**
 * Created by Administrator on 2017/5/11.
 */
import React,{Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {Select ,Option,FormControl} from 'tinper-bee';
import './index.css';

class UpdownSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "inputContent": "50MB"
        };
    }

    changeText = (event) =>{
        var value = event.target.value;
        this.setState({
            "inputContent": value
        })
    }
    render() {
        return (
            <div>
                   <span className="u-input-number u-input-group simple">
                       <input type="text" defaultValue={this.state.inputContent} onChange={this.changeText}/>
                           <span className="u-input-group-btn">
                               <div className="icon-group">
                                   <span className="plus">
                                       <span className="uf uf-arrow-up">
                                       </span></span>
                                   <span className="reduce">
                                       <span className=" uf uf-arrow-down">
                                       </span>
                                   </span>
                               </div>
                           </span>
                   </span>
            </div>
        )
    }
}
;

export default UpdownSelect;
