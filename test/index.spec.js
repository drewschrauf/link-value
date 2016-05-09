import { expect } from 'chai';
import LinkValue, { makeLink, makeMergeLink, makeCheckedLink } from '../src';

describe('Root', () => {
  it('should export LinkValue by default', () => {
    expect(LinkValue).to.be.a('function');
  });

  it('should reexport LinkBuilders', () => {
    expect(makeLink).to.be.a('function');
    expect(makeMergeLink).to.be.a('function');
    expect(makeCheckedLink).to.be.a('function');
  });
});
