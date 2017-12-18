/*
 * 项目入口文件
 * */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import routes from './routes/index';

// import 'tinper-bee/assets/tinper-bee.css';
import './index.less';
import 'bee-table/build/Table.css';
ReactDOM.render(routes, document.querySelector('#app'));
