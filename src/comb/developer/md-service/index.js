import { Component } from 'react'
import { render } from 'react-dom'

import routes from './routes'

import {objPolyfill} from './util'

const init = function (content) {
  objPolyfill();
  render(routes, content);
}

init(document.getElementById("content"));
