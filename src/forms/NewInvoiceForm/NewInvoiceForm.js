import React from 'react'
import { reduxForm } from 'redux-form'
import {Form, FormGroup, FormControl} from 'react-bootstrap'
import {Select} from 'components/common'
import {getCustomers, getProducts, getInvoices} from 'redux/modules/Invoices'
import {connect} from 'react-redux'

export const fields = ['customer', 'product', 'quantity']

export const optionsRenderer = {
  customers: ({id, name}) => ({value: id, label: name}),
  products: ({id, name, price}) => ({value: id, label: `${name} ${price}`})
}

const validate = (values) => {
  const errors = {}
  return errors
}

type Props = {
  handleSubmit: Function,
  fields: Object,
}

@reduxForm({
  form: 'NewInvoice',
  initialValues: {
    quantity: 1
  },
  fields,
  validate  
})
@connect(
  ({resources: {customers, products}}) => ({customers, products}),
  {getCustomers, getProducts}
)
export default class NewInvoice extends React.Component {
  props: Props;
  defaultProps = {
    fields: {},
  }
  static getOptionsFromResource(resource, optionsRenderer) {
    return resource.loading 
      ? []
      : resource.data.map(optionsRenderer)
  }
  render() {
    const { fields, handleSubmit, getProducts, getCustomers, customers, products } = this.props
    return (
      <Form onSubmit={handleSubmit}>
        <Select 
          onOpen={getCustomers}
          isLoading={customers.loading}
          options={NewInvoice.getOptionsFromResource(customers, optionsRenderer.customers)}
          placeholder="Select a Customer"
          {...fields.customer}
          />
        <Select 
          onOpen={getProducts}
          isLoading={products.loading}
          options={NewInvoice.getOptionsFromResource(products, optionsRenderer.products)}
          placeholder="Select some Products"
          multiple={true}
          {...fields.product}
          />
        <FormControl 
          type="number" 
          placeholder="Select Quantity" 
          {...fields.quantity} 
          />
      </Form>
    )
  }
}
