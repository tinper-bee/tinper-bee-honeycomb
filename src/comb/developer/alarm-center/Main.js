import React, {Component} from 'react';
import {Row} from 'tinper-bee'


import './index.css';


class MainPage extends Component {
   render() {
     return (
       <Row>
         {this.props.children}
       </Row>
     )
   }
}
export default MainPage;
