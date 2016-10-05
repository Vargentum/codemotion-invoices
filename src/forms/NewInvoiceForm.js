import React from 'react'
import { reduxForm, Field, Fields, FieldArray, change } from 'redux-form'
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import {Select} from 'components/common'
import {getCustomers, getProducts, getInvoices} from 'redux/modules/Invoices'
import {connect} from 'react-redux'

/* -----------------------------
  Adder:

  <Adder products={products} onQuantityChange={()}

  Problems:
  - how to compose product main data with quantity data?
  - how to send changed Q?

  Way1: merge Q into Products -> problems with syncing data
  Way2 -> keep Q separated
----------------------------- */


export const FORM_ID = 'NewInvoice'

export const fields = ['customer', 'products', 'quantities']

export const optionsRenderer = {
  customers: ({id, name}) => ({value: id, label: name}),
  products: ({id, name, price}) => ({value: id, label: `${name} $${price}`})
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
    quantities: []
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
  render() {
    const {formData, fields, handleSubmit, getProducts, getCustomers, customers, products } = this.props

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
      multi: true
    })
    return (
      <Form onSubmit={handleSubmit}>
        <Field name="customer" component={CustomerSelect} />
        <Field name="products" component={ProductSelect} />
        <FieldArray name="products" component={::this.createQuantityManager} />
        <Button type="submit" bsStyle="primary">Create new Invoice</Button>
      </Form>
    )
  }
}
