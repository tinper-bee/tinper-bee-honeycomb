import React from 'react'

import mirror, { render, Router,Switch } from 'mirrorx'
import { createLogger } from 'redux-logger'

const logger = createLogger();
import App from './App'

mirror.defaults({
  historyMode: 'hash',
  middlewares:[
    logger
  ]
})

render(
  <Router>
    <App/>
  </Router>
  , document.getElementById('app'))