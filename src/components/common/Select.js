'use strict'
import React, { Component, PropTypes as PT } from 'react'
import RSelect from 'react-select'

require('react-select/dist/react-select.css')

export default class Select extends Component {
  render() {
    return (
      <RSelect {...this.props} />
    )
  }
}
