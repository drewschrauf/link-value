import React from 'react'
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import LinkValue from '../src/LinkValue'
import TestUtils from 'react-addons-test-utils'

chai.use(sinonChai)

const v = {a: 1, b: {c: 2, d: 3}}
const vc = {a: true, b: {c: false, d: true}}

describe('LinkValue', () => {
  let c
  beforeEach(() => {
    c = sinon.spy()
  })

  describe('default', () => {
    it('should return a function', () => {
      expect(LinkValue).to.be.a('function')
    })

    it('should render child component', () => {
      let r = TestUtils.renderIntoDocument(TestComponent(<E value={v} onChange={c} path={['b', 'c']}/>))
      let input = TestUtils.findRenderedDOMComponentWithTag(r, 'input')
      expect(input).to.not.be.undefined
    })

    it('should send composed newVal when sub component changed', () => {
      let r = TestUtils.renderIntoDocument(TestComponent(<E value={v} onChange={c} path={['b', 'c']}/>))
      let input = TestUtils.findRenderedDOMComponentWithTag(r, 'input')
      TestUtils.Simulate.change(input, {target: {value: '3'}})
      expect(c).to.have.been.calledWith({a: 1, b: {c: '3', d: 3}})
    })

    it('should send composed newVal when checkbox sub component changed', () => {
      let r = TestUtils.renderIntoDocument(TestComponent(<C value={vc} onChange={c} path={['b', 'c']}/>))
      let input = TestUtils.findRenderedDOMComponentWithTag(r, 'input')
      TestUtils.Simulate.change(input, {target: {checked: true}})
      expect(c).to.have.been.calledWith({a: true, b: {c: true, d: true}})
    })

    it('should not provide utility functions if no value is passed', () => {
      let r = TestUtils.renderIntoDocument(TestComponent(<E onChange={c} path={['b', 'c']}/>))
      let p = TestUtils.findRenderedComponentWithType(r, PropChecker)
      expect(p.props.makeLink).to.be.undefined
      expect(p.props.makeMergeLink).to.be.undefined
      expect(p.props.makeCheckedLink).to.be.undefined
    })

    it('should not provide utility functions if no onChange is passed', () => {
      let r = TestUtils.renderIntoDocument(TestComponent(<E value={v} path={['b', 'c']}/>))
      let p = TestUtils.findRenderedComponentWithType(r, PropChecker)
      expect(p.props.makeLink).to.be.undefined
      expect(p.props.makeMergeLink).to.be.undefined
      expect(p.props.makeCheckedLink).to.be.undefined
    })
  })
})

//
// TESTING COMPONENTS
//

// base element to test
const E = LinkValue((props) => {
  return (
    <div>
      <PropChecker {...props} />
      {props.makeLink && <input {...props.makeLink(...props.path)}/>}
    </div>
  )
})
E.propTypes = {
  makeLink: React.PropTypes.func,
  path: React.PropTypes.array
}

const C = LinkValue((props) => {
  return (
    <div>
      <PropChecker {...props} />
      {props.makeCheckedLink && <input type='checkbox' {...props.makeCheckedLink(...props.path)}/>}
    </div>
  )
})
C.propTypes = {
  makeLink: React.PropTypes.func,
  path: React.PropTypes.array
}

class PropChecker extends React.Component {
  render () {
    return <div/>
  }
}

// wrapper for rendering
const TestComponent = (Component) => {
  return React.createElement(class Wrapper extends React.Component {
    render () {
      return Component
    }
  })
}
