/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import dateReplacer from '../../utils/json.js';

describe('Unit::Date Utils', () => {
  describe('dateReplacer()', () => {
    it('Should replace date with Date.prototype.toDateString()', () => {
      const testObject = {
        string: 'string',
        num: 10,
        date: new Date('1991-04-28'),
        arr: [],
        obj: {},
      };
      const boundDateReplacer = dateReplacer.bind(testObject);
      Object.keys(testObject).forEach((prop) => {
        testObject[prop] = boundDateReplacer(prop, testObject[prop]);
      });
      expect(testObject).to.deep.equal({
        ...testObject,
        date: 'Sun Apr 28 1991',
      });
    });
  });
});
