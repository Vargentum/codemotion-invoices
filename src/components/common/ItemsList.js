import React, {Component, createElement, PropTypes as PT} from 'react'
import {ListGroup, ListGroupItem} from 'react-bootstrap'
import _ from 'lodash'

class ItemsList extends Component {
  static propTypes = {
    data: PT.array.isRequired,
    item: PT.oneOfType([PT.element, PT.func]).isRequired,
    itemProps: PT.object
  }

  static defaultProps = {
    data: [],
    itemProps: {}
  }

  r_item = (item, props) => <ListGroupItem key={_.uniqueId()} {...this.props.itemProps}>
    {createElement(item, props, null)}
  </ListGroupItem>

  render() {
    const {data, item} = this.props

    return (
      <ListGroup>
        {data.map(this.r_item.bind(this, item))}
      </ListGroup>
    )
  }
}

export default ItemsList
