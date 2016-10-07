import React from 'react'
import {Button, Panel} from 'react-bootstrap'
import {ItemsList} from 'components/common'

function InvoiceListItem ({id, customer, discount, total}) {
  return <Panel 
    bsStyle='info'
    header={`Invoice ${id}`} 
    footer={`Total price is $${total}`} 
    >
    <p>Customer: {customer && customer.name}</p> {/*TODO: Add loading!*/}
    <p>Discount is {discount}%</p>
  </Panel>
}


type Props = {
  data: Array
};
export default class InvoicesList extends React.Component {
  props: Props;

  render () {
    const {data} = this.props
    return (
      <ItemsList data={data} item={InvoiceListItem} />
    )
  }
}
