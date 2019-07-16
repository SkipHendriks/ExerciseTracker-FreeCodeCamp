/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import { checkDateFormat, equalDate } from '../../utils/date.js';

describe('Unit::Date Utils', () => {
  describe('checkDateFormat()', () => {
    it('should return true when correct', () => {
      expect(checkDateFormat('1991-04-28')).to.be.true;
    });
    it('should return false when incorrect month is used', () => {
      expect(checkDateFormat('1991-13-28')).to.be.false;
      expect(checkDateFormat('1991-00-28')).to.be.false;
      expect(checkDateFormat('1991-nov-28')).to.be.false;
      expect(checkDateFormat('1991-fe-28')).to.be.false;
      expect(checkDateFormat('1991--28')).to.be.false;
    });
    it('should return false when incorrect day is used', () => {
      expect(checkDateFormat('1991-01-32')).to.be.false;
      expect(checkDateFormat('1991-01-00')).to.be.false;
      expect(checkDateFormat('1991-01-mon')).to.be.false;
      expect(checkDateFormat('1991-01-th')).to.be.false;
      expect(checkDateFormat('1991-04-')).to.be.false;
    });
    it('should return false when incorrect year is used', () => {
      expect(checkDateFormat('19911-01-28')).to.be.false;
      expect(checkDateFormat('1991ad-01-28')).to.be.false;
      expect(checkDateFormat('-01-28')).to.be.false;
    });
    it('should return false when incorrect delimiter is used', () => {
      expect(checkDateFormat('1991/01-28')).to.be.false;
      expect(checkDateFormat('1991/01/28')).to.be.false;
      expect(checkDateFormat('1991-01/28')).to.be.false;
    });
    it('should return false when empty string is used', () => {
      expect(checkDateFormat('')).to.be.false;
    });
    it('should return false when null is used', () => {
      expect(checkDateFormat(null)).to.be.false;
    });
    it('should return false when date is undefined', () => {
      expect(checkDateFormat(undefined)).to.be.false;
    });
  });

  describe('equalDate()', () => {
    it('should return true when dates are equal', () => {
      expect(equalDate(new Date('2010-04-04'), new Date('2010-04-04'))).to.be.true;
    });
    it('should return false when dates are not equal', () => {
      expect(equalDate(new Date('2011-04-04'), new Date('2010-04-04'))).to.be.false;
    });
    it('should throw an error when something else than a date object is passed', () => {
      expect(() => equalDate(new Date('2011-04-04'), undefined)).to.throw();
      expect(() => equalDate(new Date('2011-04-04'), '2011-04-04')).to.throw();
    });
  });
});
