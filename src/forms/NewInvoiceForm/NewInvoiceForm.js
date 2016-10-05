import React from 'react'
import { reduxForm, Field } from 'redux-form'
import {Form, FormGroup, FormControl, Button} from 'react-bootstrap'
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
  getOptionsFromResource(resource, optionsRenderer) {
    return resource.loading 
      ? []
      : resource.data.map(optionsRenderer)
  }
  handleResourceLoadRequest = (resource, loader) => () => {
    !resource.loaded && loader()
  }
  createFieldSelectComponent = (props) => ({input: {value, onChange}}) =>
    <Select
      {...props}
      value={value}
      onChange={onChange} />

  createFieldInputComponent = (props) => ({input}) =>
    <FormControl {...props} {...input} />

  render() {
    const { fields, handleSubmit, getProducts, getCustomers, customers, products } = this.props

    const CustomerSelect = this.createFieldSelectComponent({
      onOpen: this.handleResourceLoadRequest(customers, getCustomers),
      isLoading: customers.loading,
      options: this.getOptionsFromResource(customers, optionsRenderer.customers),
      placeholder: "Select a Customer"
    })
    const ProductSelect = this.createFieldSelectComponent({
      onOpen: this.handleResourceLoadRequest(products, getProducts),
      isLoading: products.loading,
      options: this.getOptionsFromResource(products, optionsRenderer.products),
      placeholder: "Select some Products",
      multiple: true
    })
    const QuantityInput = this.createFieldInputComponent({
      type: "number",
      placeholder: "Select Quantity"
    })

    return (
      <Form onSubmit={handleSubmit}>
        <Field name="customer" component={CustomerSelect} />
        <Field name="product" component={ProductSelect} />
        <Field name="quantity" component={QuantityInput} />
        <Button type="submit" bsStyle="primary">Create new Invoice</Button>
      </Form>
    )
  }
}
