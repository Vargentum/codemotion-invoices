import React, {Component, PropTypes} from 'react'
import {ListGroup, ListGroupItem} from 'react-bootstrap'
import _ from 'lodash'

class ItemsList extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    item: PropTypes.element.isRequired,
    itemProps: PropTypes.object
  }

  static defaultProps = {
    data: [],
    itemProps: {}
  }

  r_item = (Item, props) => <ListGroupItem key={_.uniqueId()} {...this.props.itemProps}>
    <Item {...props} />
  </ListGroupItem>

  render() {
    const {
      data,
      item
    } = this.props

    return (
      <ListGroup>
        {data.map(this.r_item.bind(this, item))}
      </ListGroup>
    )
  }
}

export default ItemsList
