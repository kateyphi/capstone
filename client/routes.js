import React, {Component} from 'react'
import {withRouter, Route, Switch} from 'react-router-dom'
import Table from './components/Table'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/lobby" component={Table} />
      </Switch>
    )
  }
}

export default Routes
