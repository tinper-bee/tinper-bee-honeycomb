import React from 'react'

import mirror, { render, Router,Switch } from 'mirrorx'
import App from './App'

mirror.defaults({
  historyMode: 'hash'
})

render(
  <Router>
    <App/>
  </Router>
  , document.getElementById('root'))