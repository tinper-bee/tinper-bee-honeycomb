import React, { Component } from 'react';
import TmcUplaoder from './index';

export default class UploadDemo extends Component{
    constructor(props){
        super(props);
        this.state = {
            
        };
    }
    render() {
        return (
            <div style={{
                width:'200px',
                height:'50px',
                margin: '0 auto'
            }}>
                <TmcUplaoder billID = 'code'/>
            </div>
        );
    }
}
