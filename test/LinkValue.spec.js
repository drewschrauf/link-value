import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import automock from 'automock';

chai.use(sinonChai);
chai.use(chaiEnzyme());

automock.setStubCreator(() => sinon.spy());

describe('LinkValue', () => {
  let c;
  let linkValue;
  let LinkValueModule;
  let TestComponent;
  beforeEach(() => {
    LinkValueModule = automock.require('../src/LinkValue', {
      passThru: ['react'],
    });
    linkValue = LinkValueModule.default;

    TestComponent = linkValue(props =>
      <div {...props}></div>
    );

    c = sinon.spy();
  });

  describe('default', () => {
    it('should return a function', () => {
      expect(linkValue).to.be.a('function');
    });

    it('should render child component', () => {
      const root = mount(<TestComponent />);
      const child = root.find('div');
      expect(child.length).to.equal(1);
    });

    it('should pass original props when not passing utilities', () => {
      const root = mount(<TestComponent test="test" />);
      const child = root.find('div');
      expect(child.prop('test')).to.equal('test');
    });

    it('should provide utility functions if value and onChange are present', () => {
      const root = mount(<TestComponent value="test" onChange={c} />);
      const child = root.find('div').first();
      expect(child).to.have.prop('makeLink');
      expect(child).to.have.prop('makeMergeLink');
      expect(child).to.have.prop('makeCheckedLink');
    });

    it('should not provide utility functions if value and no onChange is present', () => {
      const root = mount(<TestComponent value="test" />);
      const child = root.find('div').first();
      expect(child).to.not.have.prop('makeLink');
      expect(child).to.not.have.prop('makeMergeLink');
      expect(child).to.not.have.prop('makeCheckedLink');
    });

    it('should provide utility functions if onChange and no value is present', () => {
      const root = mount(<TestComponent onChange={c} />);
      const child = root.find('div').first();
      expect(child).to.not.have.prop('makeLink');
      expect(child).to.not.have.prop('makeMergeLink');
      expect(child).to.not.have.prop('makeCheckedLink');
    });

    ['makeLink', 'makeMergeLink', 'makeCheckedLink'].forEach(type => {
      it(`should bind value and onChange to ${type} function`, () => {
        const root = mount(<TestComponent value={{ a: 'test' }} onChange={c} />);
        const child = root.find('div').first();
        const mockMakeLink = LinkValueModule.__stubs__['./LinkBuilders'][type];
        child.prop(type)('a');

        // makeLink should be bound
        expect(mockMakeLink.getCall(0).args[0]).to.eql({ a: 'test' });
        expect(mockMakeLink.getCall(0).args[1]).to.be.a('function');
        expect(mockMakeLink.getCall(0).args[2]).to.be.equal('a');

        // the passed function should be our original function
        mockMakeLink.getCall(0).args[1]('new');
        expect(c).to.have.been.calledWith('new');
      });
    });
  });
});
