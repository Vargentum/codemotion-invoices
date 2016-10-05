import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Button} from 'react-bootstrap'
import {getCustomers, getProducts, getInvoices} from 'redux/modules/Invoices'
import InvoicesListUI from 'components/InvoicesList'
import * as cmn from 'components/common'
import * as u from 'utils'
import NewInvoiceForm from 'forms/NewInvoiceForm'


type Props = {

}
export class InvoicesList extends React.Component {
  props: Props;

  componentDidMount () {
    this.props.getInvoices()
  }
  state = {
    invoiceCreateFormVisibility: false
  }
  showInvoiceCreateForm() {
    u.makeTogglableStateFor.call(this, 'invoiceCreateFormVisibility', true)
  }
  hideInvoiceCreateForm() {
    u.makeTogglableStateFor.call(this, 'invoiceCreateFormVisibility', false)
  }
  handleInvoiceCreation(data) {
    console.log(data, '---------')
    /*this.props.getInvoices()    */
  }
  r_invoiceCreateFormModal() {
    return <cmn.Modal
      show={this.state.invoiceCreateFormVisibility}
      onHide={::this.hideInvoiceCreateForm}
      title="Create New Invoice">
        TEST
    </cmn.Modal>
  }
  render() {
    const {invoices: {loading, data}} = this.props

    if (loading) {
      return <cmn.LoadingArea />
    } else {
      return (
        <div>
          <h1>Invoices List</h1>
          <InvoicesListUI data={data} />
          {!data.length &&
            <cmn.EmptyArea>
              There are no invoices. Would you like to add a new one?
            </cmn.EmptyArea>
          }
          <Button
            onClick={::this.showInvoiceCreateForm}
            bsStyle="primary">Add new Invoice</Button>
          {this.r_invoiceCreateFormModal()}
          <NewInvoiceForm onSubmit={::this.handleInvoiceCreation} />
        </div>
      )
    }
  }
}

const mapStateToProps = ({resources: {invoices}}) => {
  return {invoices}
}
const mapDispatchToProps = {getInvoices}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoicesList)
