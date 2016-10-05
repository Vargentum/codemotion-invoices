'use strict'
import React from 'react';
import _ from 'lodash'

export cls from 'classnames'

export const mapRender = (Component, customProps={}) => (props) =>
  <Component 
    key={_.uniqueId('map-render-')} 
    {...{...props, ...customProps}} />

export function focusOnRender (node) { 
  node && node.focus() 
} 

export const noArgs = (fn) => () => fn()

export const compose = (...fns) => (initValue) => fns.reduce((p,fn) => fn.call(p, p), initValue)
export const composeRight = (...fns) => (initValue) => fns.reduceRight((p,fn) => fn.call(p, p), initValue)

export const toValidNameMod = (name) => compose(String.prototype.toLowerCase, _.kebabCase)(name)

export const implementMe = () => alert('Not Implemented!')

export const throttle = (fn, by = 1000) => _.throttle(fn, by)

export function makeTogglableStateFor(key, value) {
  if (!this.state || !this.setState) throw new Error(`Seems ${this} isn't a statefull React Component`)
  if (_.isUndefined(this.state[key])) throw new Error(`There is no key ${key} in Component's state`)
  this.setState({ 
    [key]: value || !this.state[key] 
  });
}
