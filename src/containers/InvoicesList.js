import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {getCustomers, getProducts, getInvoices} from 'redux/modules/Invoices'

type Props = {

}
export class InvoicesList extends React.Component {
  props: Props;

  componentDidMount () {
    this.props.getInvoices()
  }

  render() {
    const {invoices, getInvoices} = this.props
    return (
      <div></div>
    )
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
