import React, { Component } from 'react'
import { render } from 'react-dom'

import routes from './routes'

const init = function (content, id) {
  render(routes, content);
}

init(document.getElementById("content"));
