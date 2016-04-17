import React from 'react'
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import LinkValue, { makeLink, makeLinkMerge, makeCheckedLink } from '../src/LinkValue'
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
      expect(p.props.makeLinkMerge).to.be.undefined
      expect(p.props.makeCheckedLink).to.be.undefined
    })

    it('should not provide utility functions if no onChange is passed', () => {
      let r = TestUtils.renderIntoDocument(TestComponent(<E value={v} path={['b', 'c']}/>))
      let p = TestUtils.findRenderedComponentWithType(r, PropChecker)
      expect(p.props.makeLink).to.be.undefined
      expect(p.props.makeLinkMerge).to.be.undefined
      expect(p.props.makeCheckedLink).to.be.undefined
    })
  })

  describe('makeLink', () => {
    it('should be a function', () => {
      expect(makeLink).to.be.a('function')
    })

    describe('with path', () => {
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

      it('should unbox onChange values from synthetic events', () => {
        let r = makeLink(v, c, 'a')
        r.onChange({target: {value: 9}})
        expect(c).to.have.been.calledWith({a: 9, b: {c: 2, d: 3}})
      })
    })

    describe('without path', () => {
      it('should return a value and onChange', () => {
        let r = makeLink(v, c)
        expect(r.value).to.eql(v)
        expect(r.onChange).to.be.a('function')
      })

      it('should propagate events to supplied onChange', () => {
        let r = makeLink(v, c)
        r.onChange(9)
        expect(c).to.have.been.calledWith(9)
      })

      it('should unbox onChange values from synthetic events', () => {
        let r = makeLink(v, c)
        r.onChange({target: {value: 9}})
        expect(c).to.have.been.calledWith(9)
      })
    })
  })

  describe('makeCheckedLink', () => {
    it('should be a function', () => {
      expect(makeCheckedLink).to.be.a('function')
    })

    it('should return a checked and onChange', () => {
      let r = makeCheckedLink(vc, c, 'a')
      expect(r.checked).to.equal(true)
      expect(r.onChange).to.be.a('function')
    })

    it('should propagate events to supplied onChange', () => {
      let r = makeCheckedLink(vc, c, 'a')
      r.onChange(false)
      expect(c).to.have.been.calledWith({a: false, b: {c: false, d: true}})
    })

    it('should unbox onChange values from synthetic events', () => {
      let r = makeCheckedLink(vc, c, 'a')
      r.onChange({target: {checked: false}})
      expect(c).to.have.been.calledWith({a: false, b: {c: false, d: true}})
    })
  })

  describe('makeLinkMerge', () => {
    it('should be a function', () => {
      expect(makeLinkMerge).to.be.a('function')
    })

    describe('with path', () => {
      it('should return a value and onChange when given a path', () => {
        let r = makeLinkMerge(v, c, 'a')
        expect(r.value).to.equal(1)
        expect(r.onChange).to.be.a('function')
      })

      it('should propagate events to supplied onChange when given a path', () => {
        let r = makeLinkMerge(v, c, 'b')
        r.onChange({c: 9})
        expect(c).to.have.been.calledWith({a: 1, b: {c: 9, d: 3}})
      })

      it('should unbox onChange values from synthetic events when given a path', () => {
        let r = makeLinkMerge(v, c, 'b')
        r.onChange({target: {value: {c: 9}}})
        expect(c).to.have.been.calledWith({a: 1, b: {c: 9, d: 3}})
      })
    })

    describe('without path', () => {
      it('should return a value and onChange when not given a path', () => {
        let r = makeLinkMerge(v, c)
        expect(r.value).to.eql(v)
        expect(r.onChange).to.be.a('function')
      })

      it('should propagate events to supplied onChange when not given a path', () => {
        let r = makeLinkMerge(v, c)
        r.onChange({b: 9})
        expect(c).to.have.been.calledWith({a: 1, b: 9})
      })

      it('should unbox onChange values from synthetic events when given a path', () => {
        let r = makeLinkMerge(v, c)
        r.onChange({target: {value: {b: 9}}})
        expect(c).to.have.been.calledWith({a: 1, b: 9})
      })
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
