import React from 'react'
import { reduxForm, Field, Fields, FieldArray, change } from 'redux-form'
import {Grid, Row, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import {Select} from 'components/common'
import {getCustomers, getProducts, getInvoices} from 'redux/modules/Invoices'
import {connect} from 'react-redux'
import * as u from 'utils'
import * as fh from 'forms/formHelpers'
import style from './NewInvoiceForm.styl'


function InvoiceTotal({total, discount}) {
  const discountedValue = total * discount / 100
  return <div>
    <hr />
    <h2>Total: ${u.precisePrice(total - discountedValue)}</h2>
    <h5>You just save ${u.precisePrice(discountedValue)}!</h5>
    <hr />
  </div>
}

const discountLimit = {
  min: 0,
  max: 99
}

export const FORM_ID = 'NewInvoice'

export const fields = ['customer', 'products', 'quantities', 'discount', 'total']

export const optionsRenderer = {
  customers: ({id, name}) => ({value: id, label: name}),
  products: ({id, name, price}) => ({value: id, label: `${name} $${price}`, price})
}

const validate = ({customer, products, quantities, discount}) => {
  const errors = {}
  if (!customer) {
    errors.customer = 'Please, select a customer'
  } 
  if (!products.length) {
    errors.products = 'Please, add at least one Product'
  } 
  if (!discount) {
    errors.discount = `Should be set. Provide 0 if you don't want to pay more :)`
  } 
  if (discount < discountLimit.min || discount > discountLimit.max) {
    errors.discount = `Should be from ${discountLimit.min} to ${discountLimit.max}`
  }
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
  handleQualityChange = (oldQuantities, changedValueIdx) => ({currentTarget: {value}}) => {
    const updatedQuantities = [...oldQuantities]
    updatedQuantities[changedValueIdx] = Number(value)
    this.props.change(FORM_ID, 'quantities', updatedQuantities)
  }
  createQuantityInput(productLabel, idx) {
    const {formData: {values: {products, quantities}}} = this.props
    const productData = products[idx]
    const quantity = quantities[idx]
    return <fh.CompleteField
      id={String(productData.value)}
      label={productData.label}
      colConfig={fh.smallInputCfg}
    >
      <FormControl
        type="number"
        value={quantity}
        onChange={this.handleQualityChange(quantities, idx)}
      />
    </fh.CompleteField>
  }
  DiscountInput = fh.createFieldComponent({
    type: 'number',
    fieldProps: {
      label: "Enter a Discount",
      colConfig: fh.smallInputCfg
    }
  })
  render() {
    const {formData, fields, handleSubmit, getProducts, getCustomers, customers, products } = this.props

    const CustomerSelect = fh.createFieldComponent({
      Cmp: Select,
      onOpen: this.handleResourceLoadRequest(customers, getCustomers),
      isLoading: customers.loading,
      options: this.getOptionsFromResource(customers, optionsRenderer.customers),
      fieldProps: {
        label: "Select a Customer"
      }
    })
    const ProductSelect = fh.createFieldComponent({
      Cmp: Select,
      onOpen: this.handleResourceLoadRequest(products, getProducts),
      isLoading: products.loading,
      options: this.getOptionsFromResource(products, optionsRenderer.products),
      fieldProps: {
        label: "Select some Products",
      },
      multi: true
    })
    const QuantityManager = fh.createQuantityManager(::this.createQuantityInput)
    const showInvoiceTotal = !!formData.values.products.length
    return (
      <Form onSubmit={handleSubmit}>
        <Grid>
          <Row className={style.FieldSparcer}>
            <Field name="customer" component={CustomerSelect} />
            <Field name="products" component={ProductSelect} />
            <FieldArray name="products" component={QuantityManager} />
            <Field name="discount" component={this.DiscountInput} />
          </Row>
          <Row>
            {showInvoiceTotal && 
              <InvoiceTotal 
                total={formData.values.total} 
                discount={formData.values.discount} />
            }
            <Button type="submit" bsStyle="primary">Create new Invoice</Button>
          </Row>
        </Grid>
      </Form>
    )
  }
}
