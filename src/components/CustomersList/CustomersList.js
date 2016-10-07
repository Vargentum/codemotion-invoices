'use strict'
import React, { Component, PropTypes as PT } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import {ItemsList} from 'components/common'
import {Panel} from 'react-bootstrap'


function CustomersListItem ({id, name, address, phone}) {
  return <Panel 
    bsStyle='info'
    header={name} 
    >
    <p>Address: <b>{address}</b></p>
    <p>Phone: <b>{phone}</b></p>
  </Panel>
}


type Props = {
  data: Array
};
export default class CustomersList extends React.Component {
  props: Props;

  render () {
    const {data} = this.props
    return (
      <ItemsList data={data} item={CustomersListItem} />
    )
  }
}
