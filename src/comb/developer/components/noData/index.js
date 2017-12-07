import React, {Component} from 'react';
import './index.css';
import imgempty from '../../assets/img/taskEmpty.png';

class NoData extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="no-data">
                <img src={imgempty} width={160} height={160}/>
                <p>很抱歉，暂时没有数据哦</p>
                <p>请您稍等一会吧~</p>
            </div>
        )
    }
}

export default NoData;
