import React from 'react'
import { reduxForm, Field, Fields, FieldArray, change } from 'redux-form'
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import {Select} from 'components/common'
import {getCustomers, getProducts, getInvoices} from 'redux/modules/Invoices'
import {connect} from 'react-redux'
import * as u from 'utils'


function InvoiceTotal({data: {products, quantities, discount}}) {
  const totalPrice = products.reduce((p,n,i) => p + n.price * quantities[i], 0)
  const discountedValue = totalPrice * discount / 100
  return <div>
    <hr />
    <h2>Total: ${u.precisePrice(totalPrice - discountedValue)}</h2>
    <h5>You just save ${u.precisePrice(discountedValue)}!</h5>
    <hr />
  </div>
}


export const FORM_ID = 'NewInvoice'

export const fields = ['customer', 'products', 'quantities', 'discount']

export const optionsRenderer = {
  customers: ({id, name}) => ({value: id, label: name}),
  products: ({id, name, price}) => ({value: id, label: `${name} $${price}`, price})
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
  form: FORM_ID,
  fields,
  validate,
  initialValues: {
    products: [],
    quantities: [],
    discount: 0
  }
})
@connect(
  ({form, resources: {customers, products}}) => ({customers, products, formData: form[FORM_ID]}),
  {getCustomers, getProducts, change}
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

  handleQualityChange = (oldQuantities, changedValueIdx) => ({currentTarget: {value}}) => {
    const updatedQuantities = [...oldQuantities]
    updatedQuantities[changedValueIdx] = Number(value)
    this.props.change(FORM_ID, 'quantities', updatedQuantities)
  }
  createQuantityInput = (productLabel, idx) => {
    const {formData: {values: {products, quantities}}} = this.props
    const productData = products[idx]
    const quantity = quantities[idx]
    return <FormGroup
      controlId={String(productData.value)}  //should be string
      key={productData.value}
    >
      <ControlLabel>{productData.label}</ControlLabel>
      <FormControl
        type="number"
        value={quantity}
        onChange={this.handleQualityChange(quantities, idx)}
      />
    </FormGroup>
  }
  createQuantityManager = ({fields: {map}, meta}) => {
    return <div>
      {map(::this.createQuantityInput)}
    </div>
  }
  createInput = (props) => ({input: {value, onChange}}) => 
    <FormControl {...props} value={value} onChange={onChange} />

  render() {
    const {formData, fields, handleSubmit, getProducts, getCustomers, customers, products } = this.props

    const CustomerSelect = this.createFieldSelectComponent({
      onOpen: this.handleResourceLoadRequest(customers, getCustomers),
      isLoading: customers.loading,
      options: this.getOptionsFromResource(customers, optionsRenderer.customers),
      placeholder: "Select a Customer",
      required: true
    })
    const ProductSelect = this.createFieldSelectComponent({
      onOpen: this.handleResourceLoadRequest(products, getProducts),
      isLoading: products.loading,
      options: this.getOptionsFromResource(products, optionsRenderer.products),
      placeholder: "Select some Products",
      multi: true,
      required: true
    })
    const DiscountInput = this.createInput({
      type: 'number',
      placeholder: 'Enter a Discount'
    })
    const showInvoiceTotal = !!formData.values.products.length
    return (
      <Form onSubmit={handleSubmit}>
        <Field name="customer" component={CustomerSelect} />
        <Field name="products" component={ProductSelect} />
        <FieldArray name="products" component={::this.createQuantityManager} />
        <Field name="discount" component={DiscountInput} />
        {showInvoiceTotal && <InvoiceTotal data={formData.values} />}
        <Button type="submit" bsStyle="primary">Create new Invoice</Button>
      </Form>
    )
  }
}
