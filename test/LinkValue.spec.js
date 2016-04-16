import React from 'react'
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import LinkValue, { makeLink, makeLinkMerge } from '../src/LinkValue'
import TestUtils from 'react-addons-test-utils'

chai.use(sinonChai)

const v = {a: 1, b: {c: 2, d: 3}}

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

    it('should not provide makeLink or makeLinkMerge if no value is passed', () => {
      let r = TestUtils.renderIntoDocument(TestComponent(<E onChange={c} path={['b', 'c']}/>))
      let p = TestUtils.findRenderedComponentWithType(r, PropChecker)
      expect(p.props.makeLink).to.be.undefined
      expect(p.props.makeLinkMerge).to.be.undefined
    })

    it('should not provide makeLink or makeLinkMerge if no value is passed', () => {
      let r = TestUtils.renderIntoDocument(TestComponent(<E value={v} path={['b', 'c']}/>))
      let p = TestUtils.findRenderedComponentWithType(r, PropChecker)
      expect(p.props.makeLink).to.be.undefined
      expect(p.props.makeLinkMerge).to.be.undefined
    })
  })

  describe('makeLink', () => {
    it('should be a function', () => {
      expect(makeLink).to.be.a('function')
    })

    it('should throw if no path is defined', () => {
      expect(() => {
        makeLink(v, c)
      }).to.throw('requires a path')
    })

    it('should return a value and onChange', () => {
      let r = makeLink(v, c, 'a')
      expect(r.value).to.equal(1)
      expect(r.onChange).to.be.a('function')
    })

    it('should propagate events to supplied onChange', () => {
      let r = makeLink(v, c, 'a')
      r.onChange(9)
      expect(c).to.have.been.calledWith({a: 9, b: {c: 2, d: 3}})
    })
  })

  describe('makeLinkMerge', () => {
    it('should be a function', () => {
      expect(makeLinkMerge).to.be.a('function')
    })

    it('should return a value and onChange when given a path', () => {
      let r = makeLinkMerge(v, c, 'a')
      expect(r.value).to.equal(1)
      expect(r.onChange).to.be.a('function')
    })

    it('should return a value and onChange when not given a path', () => {
      let r = makeLinkMerge(v, c)
      expect(r.value).to.eql(v)
      expect(r.onChange).to.be.a('function')
    })

    it('should propagate events to supplied onChange when given a path', () => {
      let r = makeLinkMerge(v, c, 'b')
      r.onChange({c: 9})
      expect(c).to.have.been.calledWith({a: 1, b: {c: 9, d: 3}})
    })

    it('should propagate events to supplied onChange when not given a path', () => {
      let r = makeLinkMerge(v, c)
      r.onChange({b: 9})
      expect(c).to.have.been.calledWith({a: 1, b: 9})
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
