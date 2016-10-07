'use strict'
import React, { Component, PropTypes as PT } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import {Navbar, Nav, NavItem as BNavItem} from 'react-bootstrap'
import {Link as RouterLink} from 'react-router'


export function NavItem ({to, children, ...props}) {
  return <BNavItem {...props}>
    <RouterLink to={to}>{children}</RouterLink>
  </BNavItem>
}

type Props = {

};
export default class Navigation extends React.Component {
  props: Props;

  render () {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Invoices App</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem to="/">Invoices</NavItem>
          <NavItem to="/products">Products</NavItem>
          <NavItem to="/customers">Customers</NavItem>
        </Nav>
      </Navbar>
    )
  }
}
