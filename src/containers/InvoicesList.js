import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Button} from 'react-bootstrap'
import {getCustomers, getProducts, getInvoices, getCustomerById} from 'redux/modules/resources'
import InvoicesListUI from 'components/InvoicesList'
import * as cmn from 'components/common'
import * as u from 'utils'
import NewInvoiceForm from 'forms/NewInvoiceForm'

type Props = {

}

@connect(
  ({resources: {invoices, customers}}) => ({ invoices, customers }),
  {getInvoices, getCustomerById}
)
export default class InvoicesList extends React.Component {
  props: Props;

  componentDidMount () {
    this.props.getInvoices()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.invoices.data.length !== nextProps.invoices.data.length 
        && nextProps.invoices.loaded) {
      this.loadAvailabeInvoicesAdditionalData(nextProps.invoices)
    }
  }
  state = {
    invoiceCreateFormVisibility: false
  }
  loadAvailabeInvoicesAdditionalData(invoices) {
    invoices.data.forEach(inv => {
      this.props.getCustomerById(inv.customer_id)
    })
  }
  showInvoiceCreateForm() {
    u.makeTogglableStateFor.call(this, 'invoiceCreateFormVisibility', true)
  }
  hideInvoiceCreateForm() {
    u.makeTogglableStateFor.call(this, 'invoiceCreateFormVisibility', false)
    this.props.getInvoices()
  }
  handleInvoiceCreation(data) {
    /*this.props.getInvoices()*/
  }
  r_invoiceCreateFormModal() {
    return <cmn.Modal
      show={this.state.invoiceCreateFormVisibility}
      onHide={::this.hideInvoiceCreateForm}
      title="Create New Invoice">
        <NewInvoiceForm onSubmit={::this.handleInvoiceCreation} />
    </cmn.Modal>
  }
  getFullInvoicesData() {
    return this.props.invoices.data.map(invoice => ({
      ...invoice,
      customer: this.props.customers.data.find(({id}) => id === invoice.customer_id) // TODO: Make it faster wit Maps
    }))    
  }
  render() {
    const {invoices} = this.props

    if (invoices.loading) {
      return <cmn.LoadingArea />
    } else {
      const fullInvoicesData = this.getFullInvoicesData()
      return (
        <div>
          <h1>Invoices List</h1>
          <InvoicesListUI data={fullInvoicesData} />
          {!fullInvoicesData.length &&
            <cmn.EmptyArea>
              There are no invoices. Would you like to add a new one?
            </cmn.EmptyArea>
          }
          <Button
            onClick={::this.showInvoiceCreateForm}
            bsStyle="primary">Add new Invoice</Button>
          {this.r_invoiceCreateFormModal()}
        </div>
      )
    }
  }
}
