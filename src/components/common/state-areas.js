'use strict'
import React, { Component, PropTypes as PT } from 'react'
import _ from 'lodash'
import {Alert} from 'react-bootstrap'


export function EmptyArea ({children, ...props}) {
  return <Alert bsStyle="warning" {...props}>
    {children}
  </Alert>
}

export function LoadingArea ({children, ...props}) {
  return <Alert bsStyle="warning" {...props}>
    Loading, please wait
  </Alert>
}

