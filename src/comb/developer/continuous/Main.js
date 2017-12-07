import React,{Component} from 'react';
import {Row} from 'tinper-bee';
import './index.less';

class ApplicationContent extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <Row className="full-screen">
                {
                    this.props.children
                }
            </Row>

        )
    }

}

export default ApplicationContent;
