
import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'tinper-bee';
import classnames from 'classnames';
import './Console.css';


class Console extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: []
        };
        this.addNews = this.addNews.bind(this);
    }
    componentWillReceviceProps(){

    }

    componentDidUpdate(){
        this.refs.view.scrollTop = this.refs.view.scrollHeight;

    }
    componentDidMount() {
        //console.log(this.props);
    }

    addNews (oldData, newData) {

    }

    render () {
        const { data, className } = this.props;


        return (
            <div>
                <Col md={12} style={{ padding: 10, border: "1px solid #e1e1e1", background: "#f5f5f5"}}>
                    <div className={classnames('outer', className)}  ref="view">
                    <div>
                        <ul ref='news'>
                            {
                                data && data.map(function (item, index) {

                                    return (
                                        <li key={index}>{ item }</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    </div>
                </Col>
            </div>
        )
    }
}


export default Console;
