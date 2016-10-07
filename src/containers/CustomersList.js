'use strict'
import React, { Component, PropTypes as PT } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import {getCustomers} from 'redux/modules/resources'
import CustomersListUI from 'components/CustomersList'
import * as cmn from 'components/common'

type Props = {

}
@connect(
  ({resources: {customers}}) => ({ customers }),
  {getCustomers}
)
export default class CustomersList extends React.Component {
  props: Props;

  componentDidMount () {
    this.props.getCustomers()
  }

  render() {
    const {customers: {loading, data}} = this.props
    if (loading) {
      return <cmn.LoadingArea />
    } else {
      return (
        <div>
          <h1>Available Customers</h1>
          <CustomersListUI data={data} />
        </div>
      )
    }
  }
}
