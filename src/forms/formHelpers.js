'use strict'
import React, { Component, PropTypes as PT } from 'react'
import {Col, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap'
import _ from 'lodash'
import style from './NewInvoiceForm.styl'

export const smallInputCfg = {
  main: 2, label: 3
}

export function CompleteField ({colConfig={label: 3, main: 9}, label, id, error, children, ...props}) {
  const formGroupProps = {
    controlId: id,
    key: id
  }
  if (error) {
    formGroupProps.validationState = 'error'
  }
  return <FormGroup {...formGroupProps}>
    <Col componentClass={ControlLabel} sm={colConfig.label}>
      <span className={style.CompleteFieldLabel}>{label}</span>
    </Col>
    <Col sm={colConfig.main}>
      {children}
      {!!error && <HelpBlock>{error}</HelpBlock>}
    </Col>
  </FormGroup>
}


/* -----------------------------
  factory for redux form <Filed component={} /> fulfilling
----------------------------- */
export function createFieldComponent ({Cmp = FormControl, fieldProps, ...props}) {
  return function ({input: {value, onChange}, meta: {error}}) {
    return <CompleteField error={error} {...fieldProps}>
      <Cmp {...props} value={value} onChange={onChange} /> 
    </CompleteField>
  }
}

export function createQuantityManager(mapper) {
  return function ({fields: {map}}) {
    return <div className={style.FieldSparcer}>
      {map(mapper)}
    </div>
  }
}