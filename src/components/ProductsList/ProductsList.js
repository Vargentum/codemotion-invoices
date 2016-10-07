'use strict'
import React, { Component, PropTypes as PT } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import {ItemsList} from 'components/common'
import {Panel} from 'react-bootstrap'


function ProductListItem ({id, name, price}) {
  return <Panel 
    bsStyle='info'
    header={name} 
    >
    <p>Price: ${price}</p>
  </Panel>
}


type Props = {
  data: Array
};
export default class ProductsList extends React.Component {
  props: Props;

  render () {
    const {data} = this.props
    return (
      <ItemsList data={data} item={ProductListItem} />
    )
  }
}
