import React from 'react'
import get from 'lodash/fp/get'
import set from 'lodash/fp/set'
import extend from 'lodash/fp/extend'

// automatically unbox synthetic events to raw values
function unboxValue (e) {
  return get('target.value', e) || e
}

// replace the value with the new value
export function makeLink (value, onChange, ...path) {
  if (!path.length) {
    throw new Error('makeLink requires a path. Just use this.props.value and this.props.onChange directly.')
  }
  return {
    value: get(path, value),
    onChange: (newVal) => onChange(set(path, unboxValue(newVal), value))
  }
}

// merge the new value into the existing value
export function makeLinkMerge (value, onChange, ...path) {
  if (!path.length) {
    return {
      value: value,
      onChange: (newVal) => onChange(extend(value, unboxValue(newVal)))
    }
  }

  return {
    value: get(path, value),
    onChange: (newVal) => onChange(
      set(path, extend(get(path, value), unboxValue(newVal)), value)
    )
  }
}

export default (Component) => {
  const LinkValue = (props) => {
    const addProps = props.value != null && !!props.onChange

    const additionalProps = addProps ? {
      makeLink: makeLink.bind(null, props.value, props.onChange),
      makeLinkMerge: makeLinkMerge.bind(null, props.value, props.onChange)
    } : {}
    return <Component {...additionalProps} {...props}/>
  }
  LinkValue.propTypes = {
    value: React.PropTypes.any,
    onChange: React.PropTypes.func
  }
  return LinkValue
}
