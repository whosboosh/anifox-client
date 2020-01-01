import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import store from './store'
import App from './routes'

ReactDOM.render(
  <BrowserRouter>
    <Fragment>
      <App />
    </Fragment>
  </BrowserRouter>,
  document.getElementById('root')
)
