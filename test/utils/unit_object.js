/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import isEmptyObject from '../../utils/object.js';

describe('Unit::Object Utils', () => {
  describe('isEmptyObject()', () => {
    it('should return true when {}', () => {
      expect(isEmptyObject({})).to.be.true;
    });

    it('should return false when filled', () => {
      expect(isEmptyObject({ prop: 'val' })).to.be.false;
      expect(isEmptyObject({ prop1: 'val1', prop2: 'val2' })).to.be.false;
    });

    it('should return false when not an object', () => {
      expect(isEmptyObject('val')).to.be.false;
      expect(isEmptyObject(undefined)).to.be.false;
      expect(isEmptyObject(null)).to.be.false;
      expect(isEmptyObject([])).to.be.false;
      expect(isEmptyObject(new Date())).to.be.false;
    });
  });
});
