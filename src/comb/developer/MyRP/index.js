
import React, { Component } from 'react'
import { render } from 'react-dom'

import routes from './routes'

import '../../assets/styles/common.less';

var init = function(content,id){
  render( routes,content )



}

init(document.getElementById("content"));
