'use strict'
import React, { Component, PropTypes as PT } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import {getProducts} from 'redux/modules/resources'
import ProductsListUI from 'components/ProductsList'
import * as cmn from 'components/common'

type Props = {

}
@connect(
  ({resources: {products}}) => ({ products }),
  {getProducts}
)
export default class ProductsList extends React.Component {
  props: Props;

  componentDidMount () {
    this.props.getProducts()
  }

  render() {
    const {products: {loading, data}} = this.props
    if (loading) {
      return <cmn.LoadingArea />
    } else {
      return (
        <div>
          <h1>Available Products</h1>
          <ProductsListUI data={data} />
        </div>
      )
    }
  }
}
