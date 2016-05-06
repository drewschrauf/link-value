import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { makeLink, makeMergeLink, makeCheckedLink } from '../src/LinkBuilders'

chai.use(sinonChai)

const v = {a: 1, b: {c: 2, d: 3}}
const vc = {a: true, b: {c: false, d: true}}

describe('LinkBuilder', () => {
  let c
  beforeEach(() => {
    c = sinon.spy()
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

  describe('makeMergeLink', () => {
    it('should be a function', () => {
      expect(makeMergeLink).to.be.a('function')
    })

    describe('with path', () => {
      it('should return a value and onChange when given a path', () => {
        let r = makeMergeLink(v, c, 'a')
        expect(r.value).to.equal(1)
        expect(r.onChange).to.be.a('function')
      })

      it('should propagate events to supplied onChange when given a path', () => {
        let r = makeMergeLink(v, c, 'b')
        r.onChange({c: 9})
        expect(c).to.have.been.calledWith({a: 1, b: {c: 9, d: 3}})
      })

      it('should unbox onChange values from synthetic events when given a path', () => {
        let r = makeMergeLink(v, c, 'b')
        r.onChange({target: {value: {c: 9}}})
        expect(c).to.have.been.calledWith({a: 1, b: {c: 9, d: 3}})
      })
    })

    describe('without path', () => {
      it('should return a value and onChange when not given a path', () => {
        let r = makeMergeLink(v, c)
        expect(r.value).to.eql(v)
        expect(r.onChange).to.be.a('function')
      })

      it('should propagate events to supplied onChange when not given a path', () => {
        let r = makeMergeLink(v, c)
        r.onChange({b: 9})
        expect(c).to.have.been.calledWith({a: 1, b: 9})
      })

      it('should unbox onChange values from synthetic events when given a path', () => {
        let r = makeMergeLink(v, c)
        r.onChange({target: {value: {b: 9}}})
        expect(c).to.have.been.calledWith({a: 1, b: 9})
      })
    })
  })
})
