import React from 'react'
import { makeLink, makeMergeLink, makeCheckedLink } from './LinkBuilders'

export default (Component) => {
  const LinkValue = (props) => {
    const { value, onChange } = props
    const addProps = value != null && !!onChange

    const additionalProps = addProps ? {
      makeLink: makeLink.bind(null, value, onChange),
      makeMergeLink: makeMergeLink.bind(null, value, onChange),
      makeCheckedLink: makeCheckedLink.bind(null, value, onChange)
    } : {}
    return <Component {...additionalProps} {...props}/>
  }
  LinkValue.propTypes = {
    value: React.PropTypes.any,
    onChange: React.PropTypes.func
  }
  return LinkValue
}
