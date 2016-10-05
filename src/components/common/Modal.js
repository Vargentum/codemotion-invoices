'use strict'
import React, { Component, PropTypes as PT } from 'react'
import _ from 'lodash'
import {Modal as BModal, Button} from 'react-bootstrap'

/* -----------------------------
  Wrapper around bootstrap modal
----------------------------- */
class Modal extends Component {
  static propTypes = {
    action: PT.node,
    title: PT.string.isRequired
  }
  render() {
    const {title, children, action, ...props} = this.props
    return (
      <BModal {...props}>
        <BModal.Header closeButton>
          <BModal.Title>{title}</BModal.Title>
        </BModal.Header>
        <BModal.Body>
          {children}
        </BModal.Body>
        <BModal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          {action}
        </BModal.Footer>
      </BModal>
    )
  }
}

export default Modal
